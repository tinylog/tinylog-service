import { Service, Inject } from 'typedi';
import { JsonController, Post, Body, HeaderParam, State, UseBefore } from 'routing-controllers';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { Description, ResType } from 'routing-controllers-openapi-v3';
import { LogService } from '../services/LogService';
import { IToken } from '../interfaces/Helper';
import { Context } from 'koa';

@Service()
@JsonController('/log')
export class LogController {
  @Inject() logService: LogService;

  @Description('初次连接需要进行该请求')
  @ResType(IToken)
  @Post('/initialize')
  async initialize(@Body() body: IInitialize, @HeaderParam('Authorization') token?: string): Promise<IToken> {
    return await this.logService.initialize(body, token);
  }

  @Description(`
    当前页面的用户行为数据，如果有的话需要把前一个页面的 PageId 传回，没有 PageId 视这个页面为入口页面
    会返回 PageId，该 PageId 在发送该页面的数据资源信息的时候需要带上，以及跳转下一个页面的时候要用
  `)
  @Post('/page')
  async pageInfo(@Body() body: IPageInfo, @State('visiterId') visiterId: string) {
    // todo
  }

  @Description('当前页面的所有资源数据，需要把前面的 PageId 传回来')
  @Post('/assets')
  async assetsInfo(@Body() body: IAssetsInfo) {
    // todo
  }

  @Description('网页退出，把当前哪个页面发送过来，以及退出时间')
  @Post('/exit')
  async exit(@Body() body: IExit) {
    // todo
  }
}
