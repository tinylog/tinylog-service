import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'ip_stats' })
export class IPStats {
  @PrimaryColumn('varchar', { length: 36 })
  ip: string;

  /** 坐标 */
  @Column('varchar', { nullable: true })
  loc: string | null;

  /** 地区 */
  @Column('varchar', { nullable: true })
  region: string | null;

  /** 国家 */
  @Column('varchar', { nullable: true })
  country: string | null;

  /** hostname */
  @Column('varchar', { nullable: true })
  hostname: string | null;

  /** org */
  @Column('varchar', { nullable: true })
  org: string | null;

  /** 城市 */
  @Column('varchar', { nullable: true })
  city: string | null;
}
