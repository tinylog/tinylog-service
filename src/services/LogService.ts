import { Service } from 'typedi';
import { IInitialize, IPageInfo, IAssetsInfo } from '../interfaces/Log';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { IPStatsRepository } from '../repositories/IPStatsRepository';
import { IToken, IPageId } from '../interfaces/Helper';
import { PageRepository } from '../repositories/PageRepository';
import { HostRepository } from '../repositories/HostRepository';
import { AssetRepository } from '../repositories/AssetRepository';
import { getCache } from '../libraries/cache';
import { SESSION_DISCONNECT, SESSION_CONNECT } from '../constants';
import { Context } from 'koa';

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
    const domain = body.host;

    const host = await this.hostRepository.validateHostOrThrow(domain);

    const ipStats = await this.ipStatsRepository.getIPStats(ip);
    const token = await this.sessionRepository.createNewSession(body, ipStats, host);

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
   * 会话保持接口
   * @param body 当前页面的信息
   * @param sessionId 会话 ID
   * @param hostId 当前所访问的网站 ID
   */
  async alive(pageId: number, sessionId: number, hostId: number, ctx: Context) {
    const page = await this.pageRepository.getPage({
      id: pageId
    });

    // 发布连接通告
    await getCache().publish(
      SESSION_CONNECT,
      JSON.stringify({
        hostId,
        pageId,
        sessionId
      })
    );
    await new Promise((resolve, reject) => {
      ctx.req.on('close', async () => {
        // 发布失联通告
        await getCache().publish(
          SESSION_DISCONNECT,
          JSON.stringify({
            hostId,
            pageId: page.id,
            sessionId
          })
        );
        resolve();
      });
    });
  }
}
