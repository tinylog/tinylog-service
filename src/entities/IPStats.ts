import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'ip_stats' })
export class IPStats {
  @PrimaryColumn('varchar', { length: 36 })
  ip: string;

  /** 坐标 */
  @Column({ nullable: true })
  loc?: string;

  /** 地区 */
  @Column({ nullable: true })
  region?: string;

  /** 国家 */
  @Column({ nullable: true })
  country?: string;

  /** hostname */
  @Column({ nullable: true })
  hostname?: string;

  /** org */
  @Column({ nullable: true })
  org?: string;

  /** 城市 */
  @Column({ nullable: true })
  city?: string;
}
