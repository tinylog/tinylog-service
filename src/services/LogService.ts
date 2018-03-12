import { Service } from 'typedi';
import * as geoip from 'geoip-lite';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import SessionRepository from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import VisiterRepository from '../repositories/VisiterRepository';
import { IToken, IPageId } from '../interfaces/Helper';
import PageRepository from '../repositories/PageRepository';
import { BadRequestError } from 'routing-controllers';
import HostRepository from '../repositories/HostRepository';
import AssetRepository from '../repositories/AssetRepository';

@Service()
export class LogService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  visiterRepository: VisiterRepository = getCustomRepository(VisiterRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  assetRepository: AssetRepository = getCustomRepository(AssetRepository);

  async initialize(body: IInitialize, ip: string, hostId: number, preToken?: string): Promise<IToken> {
    const host = await this.hostRepository.findOneById(hostId);

    if (!host) {
      throw new BadRequestError('Host is not registed');
    }

    // TOKEN 有效（复用 Visiter）前提是 Token 正确且对应的 Visiter 的 IP 地址和现在的相同
    const visiter = preToken && (await this.visiterRepository.getVisiterByToken(preToken, ip));

    if (visiter) {
      const token = await this.sessionRepository.updateSession(visiter, host, preToken!);
      return {
        token
      };
    } else {
      const geo = geoip.lookup(ip);
      const newVisiter = await this.visiterRepository.save(
        this.visiterRepository.create({
          lang: body.lang,
          ua: body.ua,
          os: body.os,
          ip,
          ...geo
        })
      );
      const token = await this.sessionRepository.newSession(newVisiter, host, body.referrer);
      return {
        token
      };
    }
  }

  async savePageInfo(body: IPageInfo, visiterId: number, hostId: number): Promise<IPageId> {
    const prePage =
      body.prePageId &&
      (await this.pageRepository.findOne({
        id: body.prePageId,
        visiterId,
        hostId
      }));

    if (body.prePageId && !prePage) {
      throw new BadRequestError('PrePageId is not found');
    } else if (body.prePageId && prePage) {
      // 更新 prePage 的访问结束时间
      prePage.endTime = body.startTime;
      await this.pageRepository.save(prePage);
    }

    const page = await this.pageRepository.save(
      this.pageRepository.create({
        ...body,
        visiterId,
        hostId
      })
    );

    return {
      pageId: page.id
    };
  }

  async saveAssetsInfo(body: IAssetsInfo, visiterId: number, hostId: number) {
    const page = await this.pageRepository.findOne({
      id: body.pageId,
      visiterId,
      hostId
    });
    if (!page) {
      throw new BadRequestError('Request Page Not Found');
    }

    await this.assetRepository.save(
      this.assetRepository.create(
        body.assets.map(asset => ({
          ...asset,
          pageId: body.pageId,
          hostId,
          visiterId
        }))
      )
    );
  }

  async exit(body: IExit, visiterId: number, hostId: number) {
    const page = await this.pageRepository.findOne({
      id: body.pageId
    });

    if (!page) {
      throw new BadRequestError('Request Page Not Found');
    }

    await this.pageRepository.updateById(body.pageId, {
      exitTime: body.exitTime,
      endTime: body.exitTime
    });
  }
}
