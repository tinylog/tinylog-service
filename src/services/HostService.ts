import { Service } from 'typedi';
import { HostRepository } from '../repositories/HostRepository';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { ISimpleFilter, IHostOverviewItem, ILangItem } from '../interfaces/Host';
import { Host } from '../entities/Host';

@Service()
export class HostService {
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);

  async getHostList(userId: number): Promise<Host[]> {
    return await this.hostRepository.getHostList({ userId });
  }

  async getHostOverview(hostId: number, filter: ISimpleFilter, userId: number): Promise<IHostOverviewItem[]> {
    const host = await this.hostRepository.getHostOrThrow({
      id: hostId,
      userId
    });

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

  async getLangAnalysis(hostId: number, filter: ISimpleFilter, userId: number): Promise<ILangItem[]> {
    const host = await this.hostRepository.getHostOrThrow({
      id: hostId,
      userId
    });
    return await this.sessionRepository.getLangAnalysis(host, filter);
  }

  // async getCountryAnalysis(hostId: number, filter: ISimpleFilter, userId: number) {
  //   const host = await this.hostRepository.getHostOrThrow({
  //     id: hostId,
  //     userId
  //   });
  //   return await this.sessionRepository.getCountryAnalysis(host, filter);
  // }
}
