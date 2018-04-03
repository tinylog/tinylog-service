import { EntityRepository, Repository } from 'typeorm';
import { IPStats } from '../entities/IPStats';
// import * as ipinfo from 'ipinfo';
import * as countries from 'i18n-iso-countries';
import * as faker from 'faker';

// const ipInfoAsync = (ip: string): Promise<IPStats> =>
//   new Promise((resolve, reject) =>
//     ipinfo(ip, (err: {}, cloc: IPStats) => {
//       console.log(err, cloc);
//       resolve(err ? ({} as IPStats) : cloc);
//     })
//   );

const orgList = [
  'AS17849 Tbroad Ginam Broadcating Co., Ltd.',
  'AS679 Technische Universitat Wien',
  'AS2686 AT&T Global Network Services, LLC',
  'AS1503 Headquarters, USAISC',
  'AS2852 CESNET z.s.p.o.',
  'AS26818 Columbus Public Schools',
  'AS5410 Bouygues Telecom SA',
  'AS18881 TELEFÔNICA BRASIL S.A',
  'AS2914 NTT America, Inc.',
  'AS15796 Salt Mobile SA'
];

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
    // const geo: IPStats = await ipInfoAsync(ip);
    return await this.save(
      this.create({
        ip,
        org: orgList[faker.random.number({ min: 0, max: 9 })],
        city: faker.address.city(),
        region: faker.address.state(),
        country: countries.getName(faker.address.countryCode(), 'en')
      })
    );
  }
}
