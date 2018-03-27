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

  /** 操作系统 */
  @Column() os: string;

  /** 语言 */
  @Column() lang: string;

  /** 会话建立时间（客户端传递） */
  @Column({ type: 'datetime' })
  createdAt: Date;

  /** 会话结束时间（客户端传递） */
  @Column({ type: 'datetime', nullable: true })
  endAt?: Date;

  /**
   * 用户指纹（用来辨识是不是同一个主机访问）
   */
  @Exclude()
  @Column()
  fingerprint: string;

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
