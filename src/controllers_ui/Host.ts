import { JsonController, Get, QueryParams, State } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { HostService } from '../services/HostService';
import { IHostBasicInfoQuery } from '../interfaces/Host';

@Service()
@JsonController('/host')
export class HostController {
  @Inject() hostService: HostService;

  @Get('/basic')
  async getHostBasicInfo(@State('userId') userId: number, @QueryParams() query: IHostBasicInfoQuery) {
    return await this.hostService.getHostBasicInfo(query, userId);
  }
}
