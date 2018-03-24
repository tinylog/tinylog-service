import { Service, Inject } from 'typedi';
import { JsonController, Post, Body, State, UseBefore, Ctx } from 'routing-controllers';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { Description, ResType } from 'routing-controllers-openapi-v3';
import { LogService } from '../services/LogService';
import { IToken, IPageId } from '../interfaces/Helper';
import sessionInject from '../middlewares/sessionInject';
import { Context } from 'koa';

@Service()
@JsonController('/log')
export class LogController {
  @Inject() logService: LogService;

  @Description('建立会话')
  @ResType(IToken)
  @Post('/initialize')
  async initialize(@Ctx() ctx: Context, @Body() body: IInitialize): Promise<IToken> {
    return await this.logService.initialize(body, ctx.ip);
  }

  @Description(`页面数据`)
  @ResType(IPageId)
  @Post('/page')
  @UseBefore(sessionInject())
  async pageInfo(
    @Body() body: IPageInfo,
    @State('sessionId') sessionId: number,
    @State('hostId') hostId: number
  ): Promise<IPageId> {
    return await this.logService.savePageInfo(body, sessionId, hostId);
  }

  @Description('页面资源数据')
  @Post('/assets')
  @UseBefore(sessionInject())
  async assetsInfo(@Body() body: IAssetsInfo, @State('sessionId') sessionId: number, @State('hostId') hostId: number) {
    await this.logService.saveAssetsInfo(body, sessionId, hostId);
    return { success: true };
  }

  @Description('网页退出')
  @Post('/exit')
  @UseBefore(sessionInject())
  async exit(@Body() body: IExit, @State('sessionId') sessionId: number, @State('hostId') hostId: number) {
    await this.logService.exit(body, sessionId, hostId);
    return { success: true };
  }
}
