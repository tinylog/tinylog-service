import { Service, Inject } from 'typedi';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { SessionRepository } from '../repositories/SessionRepository';
import { getCustomRepository } from 'typeorm';
import { VisiterRepository } from '../repositories/VisiterRepository';
import { IToken } from '../interfaces/Helper';
import { PageRepository } from '../repositories/PageRepository';
import Page from '../entities/Page';

@Service()
export class LogService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  visiterRepository: VisiterRepository = getCustomRepository(VisiterRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);

  async initialize(body: IInitialize, preToken?: string): Promise<IToken> {
    const visiter = preToken && (await this.visiterRepository.getVisiterByToken(preToken));
    if (visiter) {
      const token = await this.sessionRepository.newSession(visiter);
      return {
        token
      };
    } else {
      const newVisiter = await this.visiterRepository.create(body);
      const token = await this.sessionRepository.newSession(newVisiter);
      return {
        token
      };
    }
  }

  async savePageInfo(body: IPageInfo, visiterId: string): Promise<Page> {
    const prePage = body.prePageId && (await this.pageRepository.findOneById(body.prePageId));

    const page = prePage
      ? await this.pageRepository.create({
          ...body,
          prePage
        })
      : await this.pageRepository.create({
          ...body,
          prePageId: undefined
        });

    return page;
  }
}
