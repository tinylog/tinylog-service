import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IPStats } from './IPStats';
import { Host } from './Host';
import { Page } from './Page';
import { Exclude } from 'class-transformer';

@Entity()
export class Session {
  @PrimaryGeneratedColumn() id: number;

  @Column('varchar', { length: 36 })
  ip: string;

  @Column() hostId: number;

  /** referrer */
  @Column() referrer: string;

  /** 浏览器信息 */
  @Column() ua: string;

  /** 语言 */
  @Column() lang: string;

  /** 会话建立时间（客户端传递） */
  @Column({ type: 'datetime' })
  createdAt: Date;

  /** 会话结束时间（客户端传递） */
  @Column({ type: 'datetime', nullable: true })
  endAt: Date | null;

  /**
   * 用户指纹（用来辨识是不是同一个主机访问）
   */
  @Exclude()
  @Column()
  fingerprint: string;

  /**
   * UA 解析
   */
  @Column({ nullable: true })
  browserName?: string;

  @Column({ nullable: true })
  browserVersion?: string;

  @Column({ nullable: true })
  deviceType?: string;

  @Column({ nullable: true })
  deviceVendor?: string;

  @Column({ nullable: true })
  deviceModel?: string;

  @Column({ nullable: true })
  engineName?: string;

  @Column({ nullable: true })
  engineVersion?: string;

  @Column({ nullable: true })
  osName?: string;

  @Column({ nullable: true })
  osVersion?: string;

  /**
   * 为了方便查询，提升效率，此处牺牲空间换去时间，把需要查询的
   * 地区，国家，城市拷贝进 Session 表中
   */
  /** 地区 */
  @Column({ nullable: true })
  region?: string;

  /** 国家 */
  @Column({ nullable: true })
  country?: string;

  /** 城市 */
  @Column({ nullable: true })
  city?: string;

  /** hostname */
  @Column({ nullable: true })
  hostname?: string;

  /** org */
  @Column({ nullable: true })
  org?: string;

  /** 坐标 */
  @Column({ nullable: true })
  loc?: string;

  /**
   * JoinColumn
   */

  @ManyToOne(type => IPStats)
  @JoinColumn({ name: 'ip' })
  ipStats: IPStats;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;

  @OneToMany(type => Page, page => page.session)
  pages: Page[];
}
