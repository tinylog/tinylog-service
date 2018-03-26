import { Column, Entity, ManyToOne, JoinColumn, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IPStats } from './IPStats';
import { Host } from './Host';
import { Page } from './Page';

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
  @Column() fingerprint: string;

  /**
   * JoinColumn
   */

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;

  @ManyToOne(type => IPStats)
  @JoinColumn({ name: 'ip' })
  ipStats: IPStats;

  @OneToMany(type => Page, page => page.session)
  pages: Page[];
}
