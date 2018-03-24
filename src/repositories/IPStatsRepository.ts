import { EntityRepository, Repository } from 'typeorm';
import IPStats from '../entities/IPStats';
import * as geoip from 'geoip-lite';

@EntityRepository(IPStats)
export default class IPStatsRepository extends Repository<IPStats> {
  /**
   * 获取 IP 地址的详细信息（IP 所在地，国家，地区等等）
   * 如果 IP 信息已经存储到数据库，则从数据库返回
   * 否则调用 geoip 库查询并存取数据库然后返回
   * @param ip IP 地址
   */
  async getIPStats(ip: string): Promise<IPStats> {
    const stats = await this.findOne({ ip });
    if (stats) {
      console.log(ip, stats);
      return stats;
    }
    const geo = geoip.lookup(ip);
    console.log(ip, geo);

    return await this.save(
      this.create({
        ip,
        ...geo
      })
    );
  }
}
