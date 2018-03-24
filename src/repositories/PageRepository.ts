import { EntityRepository, Repository } from 'typeorm';
import Page from '../entities/Page';
import { BadRequestError } from 'routing-controllers';

@EntityRepository(Page)
export default class PageRepository extends Repository<Page> {
  /**
   * 根据条件查询一条 Page 记录，查找不到会抛出错误
   * @param pageQuery 页面筛选条件
   */
  async getPage(pageQuery: Partial<Page>): Promise<Page> {
    const page = await this.findOne(pageQuery);
    if (page === undefined) {
      throw new BadRequestError('未找到对应页面');
    }

    return page;
  }

  /**
   * 创建一条页面数据
   * @param pageData 页面数据
   */
  async createPage(pageData: Partial<Page>): Promise<Page> {
    return await this.save(this.create(pageData));
  }

  /**
   * 将一个页面标记为当前会话的退出页面
   * @param pageId 页面 ID
   * @param time 客户端时间
   * TODO: updateResult?
   */
  async exitPage(pageId: number, time: string): Promise<void> {
    const updateResult = await this.updateById(pageId, {
      exitTime: time,
      endTime: time
    });
    console.log(updateResult);
    return;
  }
}
