import { Service } from 'typedi';
import { HostRepository } from '../repositories/HostRepository';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { ISimpleFilter } from '../interfaces/Host';
import { BadRequestError } from 'routing-controllers';

@Service()
export class HostService {
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);

  async getHostBasicInfo(hostId: number, filter: ISimpleFilter, userId: number) {
    const host = await this.hostRepository.getHost({
      id: hostId,
      userId
    });

    if (!host) {
      throw new BadRequestError('你无权限查询或者目标网站不存在');
    }

    // TODO: no test yet
    const [pvList, uvList] = await Promise.all([
      this.pageRepository.getHostPV(host.id, filter),
      this.sessionRepository.getHostUV(host.id, filter)
    ]);

    console.log(pvList, uvList);
  }
}
