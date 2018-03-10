import { EntityRepository, Repository } from 'typeorm';
import Session from '../entities/Session';
import Cache from '../libraries/Cache';
import Visiter from '../entities/Visiter';
import { MD5 } from 'crypto-js';

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
  async newSession(visiter: Visiter) {
    const token = MD5(visiter.id + Date.now().toString()).toString();
    await Cache.Instance.set(`TOKEN:${token}`, visiter.id);
    return token;
  }
}
