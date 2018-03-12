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

  async initialize(body: IInitialize, ip: string, hostId: string, preToken?: string): Promise<IToken> {
    const host = await this.hostRepository.findOne(hostId);

    if (!host) {
      throw new BadRequestError('Host is not registed');
    }

    // TOKEN 有效（复用 Visiter）前提是 Token 正确且对应的 Visiter 的 IP 地址和现在的相同
    const visiter = preToken && (await this.visiterRepository.getVisiterByToken(preToken, ip));

    if (visiter) {
      const token = await this.sessionRepository.newSession(visiter, host, body.referrer);
      return {
        token
      };
    } else {
      const geo = geoip.lookup(ip);
      const newVisiter = await this.visiterRepository.create({
        lang: body.lang,
        ua: body.ua,
        os: body.os,
        ...geo
      });
      const token = await this.sessionRepository.newSession(newVisiter, host, body.referrer);
      return {
        token
      };
    }
  }

  async savePageInfo(body: IPageInfo, visiterId: string, hostId: string): Promise<IPageId> {
    const prePage =
      body.prePageId &&
      (await this.pageRepository.findOne({
        prePageId: body.prePageId,
        visiterId,
        hostId
      }));

    if (!prePage) {
      throw new BadRequestError('PrePageId is not found');
    }

    const page = await this.pageRepository.create({
      ...body,
      visiterId,
      hostId
    });

    return {
      pageId: page.id
    };
  }

  async saveAssetsInfo(body: IAssetsInfo, visiterId: string, hostId: string) {
    const page = await this.pageRepository.findOne({
      id: body.pageId,
      visiterId,
      hostId
    });

    if (!page) {
      throw new BadRequestError('Request Page Not Found');
    }

    await this.assetRepository.create(
      body.assets.map(asset => ({
        ...asset,
        pageId: body.pageId,
        hostId,
        visiterId
      }))
    );
  }

  async exit(body: IExit, visiterId: string, hostId: string) {
    const page = await this.pageRepository.findOne({
      id: body.pageId
    });

    if (!page) {
      throw new BadRequestError('Request Page Not Found');
    }

    await this.pageRepository.update(body.pageId, {
      exitTime: body.exitTime
    });
  }
}
