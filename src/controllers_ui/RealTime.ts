import { Service, Inject } from 'typedi';
import { JsonController, Get, State, Param } from 'routing-controllers';
import { IContextState } from '../interfaces/User';
import { RealTimeService } from '../services/RealTimeService';
import { IActiveSession } from '../interfaces/RealTime';
import { ResType } from 'routing-controllers-openapi-v3';

@Service()
@JsonController('/realtime')
export class RealTimeController {
  @Inject() realTimeService: RealTimeService;

  @Get('/:id')
  @ResType(IActiveSession)
  async getCurrentVisitCount(@State('user') user: IContextState, @Param('id') id: number): Promise<IActiveSession> {
    return await this.realTimeService.getCurrentActiveSession(user.id, id);
  }
}
