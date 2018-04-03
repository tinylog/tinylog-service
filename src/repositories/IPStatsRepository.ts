import { EntityRepository, Repository } from 'typeorm';
import { IPStats } from '../entities/IPStats';
import * as ipinfo from 'ipinfo';
import * as countries from 'i18n-iso-countries';

const ipInfoAsync = (ip: string): Promise<IPStats> =>
  new Promise((resolve, reject) =>
    ipinfo(ip, (err: {}, cloc: IPStats) => {
      resolve(err ? ({} as IPStats) : cloc);
    })
  );

@EntityRepository(IPStats)
export class IPStatsRepository extends Repository<IPStats> {
  /**
   * 获取 IP 地址的详细信息（IP 所在地，国家，地区等等）
   * 如果 IP 信息已经存储到数据库，则从数据库返回
   * 否则调用 geoip 库查询并存取数据库然后返回
   * @param ip IP 地址
   */
  async getIPStats(ip: string): Promise<IPStats> {
    const stats = await this.findOne({ ip });
    if (stats) {
      return stats;
    }
    const geo: IPStats = await ipInfoAsync(ip);
    return await this.save(
      this.create({
        ip,
        ...geo,
        country: geo.country ? countries.getName(geo.country, 'zh') : null
      })
    );
  }
}
