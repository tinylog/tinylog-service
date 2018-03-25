import { EntityRepository, Repository } from 'typeorm';
import { Session } from '../entities/Session';
import { getCache } from '../libraries/cache';
import { TOKEN_KEY } from '../constants';
import { MD5 } from 'crypto-js';
import { Host } from '../entities/Host';
import { IInitialize } from '../interfaces/Log';
import { ISimpleFilter } from '../interfaces/Host';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  /**
   * 生成一个新的会话，并据此签发一个 Token 返回给前端。
   * @param body 客户端信息
   * @param host 客户端所访问的网站信息
   */
  async createNewSession(body: IInitialize, ip: string, host: Host): Promise<string> {
    const session = await this.save(
      this.create({
        ip,
        hostId: host.id,
        referrer: body.referrer,
        lang: body.lang,
        ua: body.ua,
        os: body.os,
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

  async endSession(sessioId: number, time: string) {
    return await this.updateById(sessioId, {
      endAt: time
    });
  }

  /**
   * 查询网站时间段内的 UV 以及平均访问时间
   * @param hostId 网站 ID
   * @param filter 过滤条件
   * @todo step 支持
   */
  async getHostUV(hostId: number, filter: ISimpleFilter) {
    return await this.createQueryBuilder('session')
      .select('SUM(session.fingerprint)', 'uv')
      .select('session.endAt - session.createdAt', 'time')
      .where('session.hostId = :hostId', { hostId })
      .andWhere('session.createdAt between :from and :to', filter)
      .groupBy('DATE(session.createdAt)')
      .getMany();
  }
}
