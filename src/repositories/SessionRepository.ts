import { EntityRepository, Repository } from 'typeorm';
import { Session } from '../entities/Session';
import { getCache } from '../libraries/cache';
import { TOKEN_KEY } from '../constants';
import { MD5 } from 'crypto-js';
import { Host } from '../entities/Host';
import { IInitialize } from '../interfaces/Log';
import { ISimpleFilter, IDistributionItem } from '../interfaces/Host';
import { IPStats } from '../entities/IPStats';
import * as UAParser from 'ua-parser-js';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  /**
   * 生成一个新的会话，并据此签发一个 Token 返回给前端。
   * @param body 客户端信息
   * @param host 客户端所访问的网站信息
   */
  async createNewSession(body: IInitialize, ipStats: IPStats, host: Host): Promise<string> {
    const uaParser = new UAParser(body.ua);
    const result = uaParser.getResult();
    const session = await this.save(
      this.create({
        ...ipStats,
        browserName: result.browser.name,
        browserVersion: result.browser.version,
        deviceType: result.device.type,
        deviceVendor: result.device.vendor,
        deviceModel: result.device.model,
        engineName: result.engine.name,
        engineVersion: result.engine.version,
        osName: result.os.name,
        osVersion: result.os.version,
        hostId: host.id,
        referrer: body.referrer,
        lang: body.lang,
        ua: body.ua,
        fingerprint: body.fingerprint,
        createdAt: body.createdAt
      })
    );

    const token = MD5(session.id + ':' + session.fingerprint).toString();

    // 存储 Redis 并设置一天过时
    await getCache().set(TOKEN_KEY(token), `${session.id}: ${host.id}`);
    await getCache().expire(TOKEN_KEY(token), 864e5);

    return token;
  }

  /**
   * 最近30分钟的 VV 分布（按分钟计）
   */
  async getRealTimeVV(host: Host) {
    return await this.query(
      `
      SELECT count(session.id) as vv, 
             DATE_FORMAT(CONVERT_TZ(session.createdAt, 'UTC', ?), '%Y-%m-%d %H:%i') as time
      FROM session
      WHERE session.hostId = ?
        AND session.createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 30 MINUTE) AND NOW()
      GROUP BY time
      `,
      [host.timezone, host.id]
    );
  }

  async getCurrentActiveSession(
    hostId: number
  ): Promise<
    Array<{
      referrer: string;
      browserName: string;
      deviceType: string;
      city: string;
      org: string;
      country: string;
    }>
  > {
    return await this.query(
      `
      SELECT referrer, browserName, deviceType, city, country, org
      FROM session
      WHERE hostId = ?
        AND endAt IS NULL
      `,
      [hostId]
    );
  }

  async endSession(sessioId: number, time: string) {
    return await this.updateById(sessioId, {
      endAt: time
    });
  }

  /**
   * 查询网站时间段内的 UV 以及平均访问时间
   * @param host 网站信息
   * @param filter 过滤条件
   * @todo step 支持
   */
  async getHostUV(
    host: Host,
    filter: ISimpleFilter
  ): Promise<
    Array<{
      uv: number;
      date: Date;
    }>
  > {
    return await this.query(
      `
      SELECT DATE(CONVERT_TZ(session.createdAt, 'UTC', ?)) as date, COUNT(DISTINCT session.fingerprint) as uv
      FROM session
      WHERE session.hostId = ?
        AND session.createdAt between ? and ?
      GROUP BY date
      `,
      [host.timezone, host.id, filter.from, filter.to]
    );
  }

  /**
   * 会话数（VV）和会话信息如平均会话时长
   */
  async getHostVVData(
    host: Host,
    filter: ISimpleFilter
  ): Promise<
    Array<{
      vv: number;
      date: Date;
      avgVisitTime: number;
      avgPageCount: number;
    }>
  > {
    return await this.query(
      `
      SELECT DATE(CONVERT_TZ(session.createdAt, 'UTC', ?)) as date,
             COUNT(session.id) as vv,
             ROUND(AVG(TIMESTAMPDIFF(SECOND, session.createdAt, session.endAt))) as avgVisitTime,
             AVG((
               SELECT COUNT(*)
               FROM page
               WHERE page.sessionId = session.id
             )) as avgPageCount
      FROM session
      WHERE session.hostId = ?
        AND session.createdAt between ? and ?
      GROUP BY date
      `,
      [host.timezone, host.id, filter.from, filter.to]
    );
  }

  async getDistribution(item: string, host: Host, filter: ISimpleFilter): Promise<IDistributionItem[]> {
    return await this.query(
      `
      SELECT ${item},
             COUNT(*) as count
      FROM session
      WHERE session.hostId = ?
        AND session.createdAt between ? and ?
      GROUP BY ${item}
      ORDER BY count DESC
      LIMIT 0, 10
      `,
      [host.id, filter.from, filter.to]
    );
  }
}
