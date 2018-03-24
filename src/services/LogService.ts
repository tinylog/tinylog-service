import { Service } from 'typedi';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import SessionRepository from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import IPStatsRepository from '../repositories/IPStatsRepository';
import { IToken, IPageId } from '../interfaces/Helper';
import PageRepository from '../repositories/PageRepository';
import HostRepository from '../repositories/HostRepository';
import AssetRepository from '../repositories/AssetRepository';

@Service()
export class LogService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  ipStatsRepository: IPStatsRepository = getCustomRepository(IPStatsRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  assetRepository: AssetRepository = getCustomRepository(AssetRepository);

  /**
   * 根据客户端信息初始化连接，生成一个新的 TOKEN 给客户端。
   *
   * @param body 客户端信息
   * @param ip 客户端的 IP 地址
   */
  async initialize(body: IInitialize, ip: string): Promise<IToken> {
    const website = body.host;

    const host = await this.hostRepository.validateHost(website);

    await this.ipStatsRepository.getIPStats(ip);
    const token = await this.sessionRepository.createNewSession(body, ip, host);

    return { token };
  }

  /**
   * 保存页面信息，并返回该页面 ID
   * @param body 页面信息
   * @param sessionId 会话 ID
   * @param hostId 网站 ID
   */
  async savePageInfo(body: IPageInfo, sessionId: number, hostId: number): Promise<IPageId> {
    if (body.prePageId !== undefined) {
      const prePage = await this.pageRepository.getPage({
        id: body.prePageId,
        sessionId
      });
      prePage.endAt = body.createdAt;
      await this.pageRepository.save(prePage);
    }

    const page = await this.pageRepository.createPage({
      ...body,
      hostId,
      sessionId
    });

    return {
      pageId: page.id
    };
  }

  /**
   * 保存当前页面的资源加载信息
   * @param body 资源列表数据
   * @param sessionId 当前会话 ID
   * @param hostId 当前所访问的网站 ID
   */
  async saveAssetsInfo(body: IAssetsInfo, sessionId: number, hostId: number) {
    const page = await this.pageRepository.getPage({
      id: body.pageId,
      sessionId
    });

    await this.assetRepository.createAssets(
      body.assets.map(asset => ({
        ...asset,
        pageId: page.id,
        hostId,
        sessionId
      }))
    );
  }

  /**
   * 标记一个页面为退出页面
   * @param body 当前页面的信息
   * @param sessionId 会话 ID
   * @param hostId 当前所访问的网站 ID
   */
  async exit(body: IExit, sessionId: number, hostId: number) {
    const page = await this.pageRepository.getPage({
      id: body.pageId
    });

    await Promise.all([
      this.pageRepository.exitPage(page.id, body.exitTime),
      this.sessionRepository.endSession(page.id, body.exitTime)
    ]);
  }
}
