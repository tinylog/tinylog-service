import { EntityRepository, Repository } from 'typeorm';
import Visiter from '../entities/Visiter';
import Cache from '../libraries/Cache';

@EntityRepository(Visiter)
export default class VisiterRepository extends Repository<Visiter> {
  async getVisiterByToken(token: string, ip: string) {
    const visiterId = await Cache.Instance.get(`TOKEN:${token}`);
    if (!visiterId) {
      return undefined;
    }

    return await this.findOne({
      id: visiterId,
      ip
    });
  }
}
