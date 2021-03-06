import { Service } from 'typedi';
import { HostRepository } from '../repositories/HostRepository';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { AssetRepository } from '../repositories/AssetRepository';
import { getCustomRepository } from 'typeorm';
import {
  ISimpleFilter,
  IHostOverviewItem,
  IDistributionItem,
  ISlowestAssetItem,
  ISlowestPageItem,
  ICreateNewHost,
  IDeleteHost,
  IUpdateHost
} from '../interfaces/Host';
import { Host } from '../entities/Host';
import { BadRequestError } from 'routing-controllers';

@Service()
export class HostService {
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  assetRepository: AssetRepository = getCustomRepository(AssetRepository);

  async getHostList(userId: number): Promise<Host[]> {
    return await this.hostRepository.getHostList({ userId });
  }

  async getHost(userId: number, hostId: number) {
    return await this.hostRepository.getHostOrThrow({
      userId,
      id: hostId
    });
  }

  async deleteHost(userId: number, body: IDeleteHost) {
    await this.hostRepository.deleteHost(userId, body);
  }

  /**
   * TODO: 更新失败的处理
   */
  async updateHost(userId: number, id: number, body: IUpdateHost) {
    if (Object.keys(body).length === 0) {
      throw new BadRequestError('你想更新啥');
    }

    await this.hostRepository.update(
      {
        id,
        userId,
        deletedAt: null
      },
      body
    );
  }

  async createNewHost(userId: number, body: ICreateNewHost): Promise<Host> {
    const host = await this.hostRepository.getHostIncludeSoftDelete({
      domain: body.domain,
      userId
    });

    if (host) {
      if (host.deletedAt === null) {
        throw new BadRequestError('您已经注册了该网站');
      } else {
        await this.hostRepository.updateById(host.id, {
          timezone: body.timezone,
          deletedAt: null
        });
        return Object.assign(host, body);
      }
    } else {
      const list = body.domain.split('.');
      if (list.length < 2) {
        throw new BadRequestError('域名有误');
      }

      return await this.hostRepository.save(
        this.hostRepository.create({
          domain: body.domain,
          timezone: body.timezone,
          userId
        })
      );
    }
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

  async getDistribution(
    hostId: number,
    item: string,
    filter: ISimpleFilter,
    userId: number
  ): Promise<IDistributionItem[]> {
    const host = await this.hostRepository.getHostOrThrow({
      id: hostId,
      userId
    });
    return await this.sessionRepository.getDistribution(item, host, filter);
  }

  async getSlowestAssetList(hostId: number, userId: number, filter: ISimpleFilter): Promise<ISlowestAssetItem[]> {
    const host = await this.hostRepository.getHostOrThrow({
      id: hostId,
      userId
    });
    return await this.assetRepository.getSlowestAssetList(host, filter);
  }

  async getSlowestPageList(hostId: number, userId: number, filter: ISimpleFilter): Promise<ISlowestPageItem[]> {
    const host = await this.hostRepository.getHostOrThrow({
      id: hostId,
      userId
    });
    return await this.pageRepository.getSlowestPageList(host, filter);
  }
}
