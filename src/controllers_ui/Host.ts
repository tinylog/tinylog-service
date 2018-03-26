import { JsonController, Get, QueryParams, State, Param } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { HostService } from '../services/HostService';
import { ISimpleFilter, IHostPVUVItem } from '../interfaces/Host';
import { IContextState } from '../interfaces/User';
import { ResType } from 'routing-controllers-openapi-v3';
import { Host } from '../entities/Host';

@Service()
@JsonController('/host')
export class HostController {
  @Inject() hostService: HostService;

  @Get('/')
  @ResType([Host])
  async getHostList(@State('user') user: IContextState): Promise<Host[]> {
    return await this.hostService.getHostList(user.id);
  }

  @Get('/:id([0-9]+)/overview')
  @ResType([IHostPVUVItem])
  async getPVUVList(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ): Promise<IHostPVUVItem[]> {
    return await this.hostService.getOverview(id, query, user.id);
  }
}
