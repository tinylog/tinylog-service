import { EntityRepository, Repository } from 'typeorm';
import { Page } from '../entities/Page';
import { BadRequestError } from 'routing-controllers';
import { ISimpleFilter, ISlowestPageItem } from '../interfaces/Host';
import { Host } from '../entities/Host';
import { IActivePage } from '../interfaces/RealTime';

@EntityRepository(Page)
export class PageRepository extends Repository<Page> {
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
   */
  async updatePageEndAt(pageId: number, time: string | null): Promise<void> {
    return await this.updateById(pageId, {
      endAt: time
    });
  }

  /**
   * 获取网站的 PV，计算方式是根据 page count 计算
   * @param host 网站信息
   * @param filter 筛选条件
   * @todo step 支持
   */
  async getHostPV(
    host: Host,
    filter: ISimpleFilter
  ): Promise<
    Array<{
      pv: number;
      date: Date;
    }>
  > {
    return await this.query(
      `
      SELECT DATE(CONVERT_TZ(page.createdAt, 'UTC', ?)) as date, COUNT(*) as pv
      FROM   page
      WHERE  page.hostId = ?
        AND  page.createdAt between ? and ?
      GROUP BY date
    `,
      [host.timezone, host.id, filter.from, filter.to]
    );
  }

  /**
   * 慢页面查询
   */
  async getSlowestPageList(host: Host, filter: ISimpleFilter): Promise<ISlowestPageItem[]> {
    return await this.query(
      `
      SELECT AVG(page.loadPage) as avgLoadPage,
             AVG(page.domReady) as avgDomReady,
             AVG(page.redirect) as avgRedirect,
             AVG(page.lookupDomain) as avgLookupDomain,
             AVG(page.ttfb) as avgTtfb,
             AVG(page.request) as avgRequest,
             AVG(page.tcp) as avgTcp,
             AVG(page.loadEvent) as avgLoadEvent,
             page.url as url
      FROM   page
      WHERE  page.hostId = ?
        AND  page.createdAt between ? and ?
      GROUP BY url
      ORDER BY avgLoadPage
      LIMIT 0, 10
      `,
      [host.id, filter.from, filter.to]
    );
  }

  /**
   * 当前最活跃的网页
   */
  async getCurrentMostActivePage(hostId: number): Promise<IActivePage> {
    return await this.query(
      `
      SELECT page.url as url,
             COUNT(page.id) as count
      FROM session
      LEFT JOIN page ON page.id = (
        SELECT MAX(p.id) as pid
        FROM page p
        WHERE p.sessionId = session.id
      )
      WHERE session.hostId = ?
        AND session.endAt IS NULL 
      GROUP BY url
      ORDER BY count DESC
      LIMIT 0, 20
      `,
      [hostId]
    );
  }
}
