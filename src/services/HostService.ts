import { Service } from 'typedi';
import { HostRepository } from '../repositories/HostRepository';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { ISimpleFilter, IHostOverviewItem } from '../interfaces/Host';
import { BadRequestError } from 'routing-controllers';
import { Host } from '../entities/Host';

@Service()
export class HostService {
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);

  async getHostList(userId: number): Promise<Host[]> {
    return await this.hostRepository.getHostList({ userId });
  }

  async getOverview(hostId: number, filter: ISimpleFilter, userId: number): Promise<IHostOverviewItem[]> {
    const host = await this.hostRepository.getHost({
      id: hostId,
      userId
    });

    if (!host) {
      throw new BadRequestError('你无权限查询或者目标网站不存在');
    }

    const [pvList, uvList, vvList] = await Promise.all([
      this.pageRepository.getHostPV(host, filter),
      this.sessionRepository.getHostUV(host, filter),
      this.sessionRepository.getHostVVData(host, filter)
    ]);

    return pvList.map(pvItem => ({
      ...pvItem,
      ...uvList.find(uvItem => uvItem.date.getTime() === pvItem.date.getTime())!,
      ...vvList.find(vvItem => vvItem.date.getTime() === pvItem.date.getTime())!
    }));
  }
}
