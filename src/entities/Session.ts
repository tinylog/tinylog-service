import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany, Index } from 'typeorm';
import { IPStats } from './IPStats';
import { Host } from './Host';
import { Page } from './Page';
import { Exclude } from 'class-transformer';

@Entity()
@Index(['createdAt'])
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
  @Column('varchar', { nullable: true })
  browserName: string | null;

  @Column('varchar', { nullable: true })
  browserVersion: string | null;

  @Column('varchar', { nullable: true })
  deviceType: string | null;

  @Column('varchar', { nullable: true })
  deviceVendor: string | null;

  @Column('varchar', { nullable: true })
  deviceModel: string | null;

  @Column('varchar', { nullable: true })
  engineName: string | null;

  @Column('varchar', { nullable: true })
  engineVersion: string | null;

  @Column('varchar', { nullable: true })
  osName: string | null;

  @Column('varchar', { nullable: true })
  osVersion: string | null;

  /**
   * 为了方便查询，提升效率，此处牺牲空间换去时间，把需要查询的
   * 地区，国家，城市拷贝进 Session 表中
   */
  /** 地区 */
  @Column('varchar', { nullable: true })
  region: string | null;

  /** 国家 */
  @Column('varchar', { nullable: true })
  country: string | null;

  /** 城市 */
  @Column('varchar', { nullable: true })
  city: string | null;

  /** hostname */
  @Column('varchar', { nullable: true })
  hostname: string | null;

  /** org */
  @Column('varchar', { nullable: true })
  org: string | null;

  /** 坐标 */
  @Column('varchar', { nullable: true })
  loc: string | null;

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
