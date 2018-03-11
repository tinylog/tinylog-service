import { Service, Inject } from 'typedi';
import { JsonController, Post, Body, HeaderParam, State, UseBefore } from 'routing-controllers';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { Description, ResType } from 'routing-controllers-openapi-v3';
import { LogService } from '../services/LogService';
import { IToken, IPageId } from '../interfaces/Helper';
import hostInject from '../middlewares/hostInject';
import sessionInject from '../middlewares/sessionInject';

@Service()
@JsonController('/log')
export class LogController {
  @Inject() logService: LogService;

  @Description('建立会话')
  @ResType(IToken)
  @Post('/initialize')
  @UseBefore(hostInject())
  async initialize(
    @Body() body: IInitialize,
    @State('hostId') hostId: string,
    @HeaderParam('Authorization') token?: string
  ): Promise<IToken> {
    return await this.logService.initialize(body, hostId, token);
  }

  @Description(`页面数据`)
  @ResType(IPageId)
  @Post('/page')
  @UseBefore(sessionInject())
  async pageInfo(
    @Body() body: IPageInfo,
    @State('visiterId') visiterId: string,
    @State('hostId') hostId: string
  ): Promise<IPageId> {
    return await this.logService.savePageInfo(body, visiterId, hostId);
  }

  @Description('页面资源数据')
  @Post('/assets')
  @UseBefore(sessionInject())
  async assetsInfo(@Body() body: IAssetsInfo, @State('visiterId') visiterId: string, @State('hostId') hostId: string) {
    return await this.logService.saveAssetsInfo(body, visiterId, hostId);
  }

  @Description('网页退出')
  @Post('/exit')
  @UseBefore(sessionInject())
  async exit(@Body() body: IExit, @State('visiterId') visiterId: string, @State('hostId') hostId: string) {
    return await this.logService.exit(body, visiterId, hostId);
  }
}
