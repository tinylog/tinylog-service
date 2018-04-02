import { SessionRepository } from '../repositories/SessionRepository';
import { HostRepository } from '../repositories/HostRepository';
import { groupBy } from 'lodash';
import { IActiveSession } from '../interfaces/RealTime';
import { getCustomRepository } from 'typeorm';

export class RealTimeService {
  sessionRepository: SessionRepository = getCustomRepository(SessionRepository);
  hostRepository: HostRepository = getCustomRepository(HostRepository);

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
}
