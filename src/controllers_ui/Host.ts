import { JsonController, Get, QueryParams, State, Param } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { HostService } from '../services/HostService';
import { ISimpleFilter, IHostOverviewItem, ILangItem } from '../interfaces/Host';
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
  @ResType([IHostOverviewItem])
  async getPVUVList(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ): Promise<IHostOverviewItem[]> {
    return await this.hostService.getHostOverview(id, query, user.id);
  }

  @Get('/:id([0-9]+)/lang')
  @ResType([ILangItem])
  async getSessionOverview(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ): Promise<ILangItem[]> {
    return await this.hostService.getLangAnalysis(id, query, user.id);
  }
}
