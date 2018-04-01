import { Inject } from 'typedi';
import { SessionRepository } from '../repositories/SessionRepository';
import { HostRepository } from '../repositories/HostRepository';
import { groupBy } from 'lodash';
import { IActiveSession } from '../interfaces/RealTime';

export class RealTimeService {
  @Inject() sessionRepository: SessionRepository;
  @Inject() hostRepository: HostRepository;

  async getCurrentActiveSession(userId: number, hostId: number): Promise<IActiveSession> {
    await this.hostRepository.getHostOrThrow({
      userId,
      id: hostId
    });

    const sessions = await this.sessionRepository.getCurrentActiveSession(hostId);

    const currentSessionCount = sessions.length;

    const data = Object.keys(sessions).reduce(
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
