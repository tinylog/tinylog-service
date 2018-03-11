import { Service } from 'typedi';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { VisiterRepository } from '../repositories/VisiterRepository';
import { IToken, IPageId } from '../interfaces/Helper';
import { PageRepository } from '../repositories/PageRepository';
import { BadRequestError } from 'routing-controllers';
import { HostRepository } from '../repositories/HostRepository';
import { AssetRepository } from '../repositories/AssetRepository';

@Service()
export class LogService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  visiterRepository: VisiterRepository = getCustomRepository(VisiterRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  assetRepository: AssetRepository = getCustomRepository(AssetRepository);

  async initialize(body: IInitialize, hostId: string, preToken?: string): Promise<IToken> {
    const host = await this.hostRepository.findOneById(hostId);

    if (!host) {
      throw new BadRequestError('Host is not registed');
    }

    const visiter = preToken && (await this.visiterRepository.getVisiterByToken(preToken));

    if (visiter) {
      const token = await this.sessionRepository.newSession(visiter, host, body.referrer);
      return {
        token
      };
    } else {
      const newVisiter = await this.visiterRepository.create(body);
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
    const page = await this.pageRepository.findOneById({
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
    const page = await this.pageRepository.findOneById({
      id: body.pageId
    });

    if (!page) {
      throw new BadRequestError('Request Page Not Found');
    }

    await this.pageRepository.updateById(body.pageId, {
      exitTime: body.exitTime
    });
  }
}
