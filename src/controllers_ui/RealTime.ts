import { Service, Inject } from 'typedi';
import { JsonController, Get, State, Param } from 'routing-controllers';
import { IContextState } from '../interfaces/User';
import { RealTimeService } from '../services/RealTimeService';
import { IActiveSession, IActivePage } from '../interfaces/RealTime';
import { ResType } from 'routing-controllers-openapi-v3';

@Service()
@JsonController('/realtime')
export class RealTimeController {
  @Inject() realTimeService: RealTimeService;

  @Get('/:id/overview')
  @ResType(IActiveSession)
  async getCurrentVisitCount(@State('user') user: IContextState, @Param('id') id: number): Promise<IActiveSession> {
    return await this.realTimeService.getCurrentActiveSession(user.id, id);
  }

  @Get('/:id/page')
  @ResType(IActivePage)
  async getCurrentMostActivePage(@State('user') user: IContextState, @Param('id') id: number): Promise<IActivePage> {
    return await this.realTimeService.getCurrentMostActivePage(user.id, id);
  }

  @Get('/:id/vv')
  async getRealTimeVV(@State('user') user: IContextState, @Param('id') id: number) {
    return await this.realTimeService.getRealTimeVV(user.id, id);
  }
}
