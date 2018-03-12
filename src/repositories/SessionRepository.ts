import { EntityRepository, Repository } from 'typeorm';
import Session from '../entities/Session';
import Cache from '../libraries/Cache';
import Visiter from '../entities/Visiter';
import { MD5 } from 'crypto-js';
import Host from '../entities/Host';

@EntityRepository(Session)
export default class SessionRepository extends Repository<Session> {
  async newSession(visiter: Visiter, host: Host, referrer: string) {
    const token = MD5(visiter.id + host.id + Date.now().toString()).toString();
    const session = await this.save(
      this.create({
        visiterId: visiter.id,
        hostId: host.id,
        referrer
      })
    );

    await Cache.Instance.set(`TOKEN:${token}`, `${session.hostId}:${session.visiterId}`);

    return token;
  }

  async updateSession(visiter: Visiter, host: Host, preToken: string) {
    const token = MD5(visiter.id + host.id + Date.now().toString()).toString();
    await Cache.Instance.set(`TOKEN:${token}`, `${host.id}:${visiter.id}`);
    await Cache.Instance.del(`TOKEN:${preToken}`);
    return token;
  }
}
