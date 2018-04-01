import { EntityRepository, Repository } from 'typeorm';
import { Host } from '../entities/Host';
import { BadRequestError } from 'routing-controllers';
import { IDeleteHost } from '../interfaces/Host';

@EntityRepository(Host)
export class HostRepository extends Repository<Host> {
  /**
   * 检查这个网站是否已经加入了统计，如果加入了则返回查询结果，否则抛出错误
   * @param domain 网址
   */
  async validateHostOrThrow(domain: string): Promise<Host> {
    const host = await this.createQueryBuilder('host')
      .where('host.domain = :domain', { domain })
      .andWhere('host.deletedAt IS NULL')
      .getOne();

    if (!host) {
      throw new BadRequestError('请检查网站是否已经加入统计');
    }

    return host;
  }

  /**
   * TODO: 无法删除的 hostId 处理
   */
  async deleteHost(userId: number, body: IDeleteHost) {
    return await this.query(
      `
      UPDATE host
      SET deletedAt = NOW()
      WHERE userId = ?  
        AND id in (?)
        AND deletedAt IS NULL
      `,
      [userId, body.list.join(',')]
    );
  }

  /**
   * 不会过滤软删除
   */
  async getHostIncludeSoftDelete(query: Partial<Host>) {
    return await this.findOne(query);
  }

  /**
   * 会过滤掉软删除的
   */
  async getHostOrThrow(query: Partial<Host>) {
    const host = await this.findOne({
      ...query,
      deletedAt: null
    });
    if (!host) {
      throw new BadRequestError('你无权限查询或者目标网站不存在');
    }

    return host;
  }

  /**
   * 会过滤掉软删除的
   */
  async getHostList(query: Partial<Host>) {
    return await this.find({
      ...query,
      deletedAt: null
    });
  }
}
