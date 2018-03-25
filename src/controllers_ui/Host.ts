import { JsonController, Get, QueryParams, State, Param } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { HostService } from '../services/HostService';
import { ISimpleFilter } from '../interfaces/Host';
import { IContextState } from '../interfaces/User';

@Service()
@JsonController('/host')
export class HostController {
  @Inject() hostService: HostService;

  @Get('/:id([0-9]+)/basic')
  async getHostBasicInfo(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ) {
    return await this.hostService.getHostBasicInfo(id, query, user.id);
  }
}
