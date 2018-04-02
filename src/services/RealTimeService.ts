import { SessionRepository } from '../repositories/SessionRepository';
import { HostRepository } from '../repositories/HostRepository';
import { groupBy } from 'lodash';
import { IActiveSession, IActivePage } from '../interfaces/RealTime';
import { getCustomRepository } from 'typeorm';
import { PageRepository } from '../repositories/PageRepository';

export class RealTimeService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  hostRepository: HostRepository = getCustomRepository(HostRepository);
  pageRepository: PageRepository = getCustomRepository(PageRepository);

  async getCurrentActiveSession(userId: number, hostId: number): Promise<IActiveSession> {
    await this.hostRepository.getHostOrThrow({
      userId,
      id: hostId
    });

    const sessions = await this.sessionRepository.getCurrentActiveSession(hostId);

    const currentSessionCount = sessions.length;

    if (currentSessionCount === 0) {
      return {
        referrer: [],
        browserName: [],
        deviceType: [],
        city: [],
        org: [],
        country: [],
        count: 0
      } as IActiveSession;
    }

    const data = Object.keys(sessions[0]).reduce(
      (pre, nextKey: string) => ({
        ...pre,
        [nextKey]: Object.entries(groupBy(sessions, nextKey)).map(([k, v]) => ({ [nextKey]: k, count: v.length }))
      }),
      {}
    );

    return {
      count: currentSessionCount,
      ...data
    } as IActiveSession;
  }

  async getCurrentMostActivePage(userId: number, hostId: number): Promise<IActivePage> {
    await this.hostRepository.getHostOrThrow({
      userId,
      id: hostId
    });

    return await this.pageRepository.getCurrentMostActivePage(hostId);
  }
}
