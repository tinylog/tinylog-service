import { Service } from 'typedi';
import { JsonController, Post, Body } from 'routing-controllers';
import { IInitialize, IPageInfo, IAssetsInfo, IExit } from '../interfaces/Log';
import { Description } from 'routing-controllers-openapi-v3';

@Service()
@JsonController('/log')
export class LogController {
  @Description('初次连接需要进行该请求，服务端会进行 Cookie 处理，前端无需关心返回值')
  @Post('/initialize')
  async initialize(@Body() body: IInitialize) {
    // todo
  }

  @Description(`
    当前页面的用户行为数据，如果有的话需要把前一个页面的 PageId 传回，没有 PageId 视这个页面为入口页面
    会返回 PageId，该 PageId 在发送该页面的数据资源信息的时候需要带上，以及跳转下一个页面的时候要用
  `)
  @Post('/page')
  async pageInfo(@Body() body: IPageInfo) {
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
