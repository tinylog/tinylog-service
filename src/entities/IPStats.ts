import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'ip_stats' })
export default class IPStats {
  @PrimaryColumn('varchar', { length: 36 })
  ip: string;

  /** 地区 */
  @Column({ nullable: true })
  region?: string;

  /** 国家 */
  @Column({ nullable: true })
  country?: string;

  /** LL */
  @Column('json', { nullable: true })
  ll?: string[];

  /** range */
  @Column('json', { nullable: true })
  range?: string[];

  /** 城市 */
  @Column({ nullable: true })
  city?: string;
}
