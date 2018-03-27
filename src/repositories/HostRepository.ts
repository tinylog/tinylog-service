import { EntityRepository, Repository } from 'typeorm';
import { Host } from '../entities/Host';
import { BadRequestError } from 'routing-controllers';

@EntityRepository(Host)
export class HostRepository extends Repository<Host> {
  /**
   * 检查这个网站是否已经加入了统计，如果加入了则返回查询结果，否则抛出错误
   * @param website 网址
   */
  async validateHostOrThrow(website: string): Promise<Host> {
    const host = await this.findOne({ website });

    if (!host) {
      throw new BadRequestError('请检查网站是否已经加入统计');
    }

    return host;
  }

  async getHostOrThrow(query: Partial<Host>) {
    const host = await this.findOne(query);
    if (!host) {
      throw new BadRequestError('你无权限查询或者目标网站不存在');
    }

    return host;
  }

  async getHostList(query: Partial<Host>) {
    return await this.find(query);
  }
}
