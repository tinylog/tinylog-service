import { EntityRepository, Repository } from 'typeorm';
import Session from '../entities/Session';
import { getCache } from '../libraries/cache';
import { TOKEN_KEY } from '../constants';
import { MD5 } from 'crypto-js';
import Host from '../entities/Host';
import { IInitialize } from '../interfaces/Log';

@EntityRepository(Session)
export default class SessionRepository extends Repository<Session> {
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
}
