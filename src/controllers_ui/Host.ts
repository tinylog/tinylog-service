import { JsonController, Get, QueryParams, State, Param, Post, Body } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { HostService } from '../services/HostService';
import {
  ISimpleFilter,
  IHostOverviewItem,
  IDistributionItem,
  ISlowestAssetItem,
  ISlowestPageItem,
  ICreateNewHost
} from '../interfaces/Host';
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

  @Post('/create')
  @ResType([Host])
  async createNewHost(@State('user') user: IContextState, @Body() body: ICreateNewHost): Promise<Host> {
    return await this.hostService.createNewHost(user.id, body);
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

  @Get('/:id([0-9]+)/distribution/:item(referrer|lang|country|region|city|osName|browserName|engineName|hostname|org)')
  @ResType([IDistributionItem])
  async getDistribution(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @Param('item') item: string,
    @QueryParams() query: ISimpleFilter
  ): Promise<IDistributionItem[]> {
    return await this.hostService.getDistribution(id, item, query, user.id);
  }

  @Get('/:id([0-9]+)/assets/slow')
  @ResType([ISlowestAssetItem])
  async getSlowestAssetList(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ): Promise<ISlowestAssetItem[]> {
    return await this.hostService.getSlowestAssetList(id, user.id, query);
  }

  @Get('/:id([0-9]+)/pages/slow')
  @ResType([ISlowestPageItem])
  async getSloestPageList(
    @State('user') user: IContextState,
    @Param('id') id: number,
    @QueryParams() query: ISimpleFilter
  ): Promise<ISlowestPageItem[]> {
    return await this.hostService.getSlowestPageList(id, user.id, query);
  }
}
