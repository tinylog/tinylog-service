import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import Asset from './Asset';
import Session from './Session';
import Host from './Host';

@Entity()
export default class Page {
  @PrimaryGeneratedColumn() id: number;

  /** 当前页面 */
  @Column() url: string;

  /** 来源 */
  @Column() referrer: string;

  /** 页面加载开始到完成时间 */
  @Column() loadPage: number;

  /** 解析dom树的时间 */
  @Column() domReady: number;

  /** 重定向的时间 */
  @Column() redirect: number;

  /** DNS查询时间 */
  @Column() lookupDomain: number;

  /** 读取页面第一个字节的时间 */
  @Column() ttfb: number;

  /** 内容加载完成的时间 */
  @Column() request: number;

  /** tcp建立连接完成握手的时间 */
  @Column() tcp: number;

  /** 执行onload回调函数的时间 */
  @Column() loadEvent: number;

  /** 当前页面的访问开始时间 */
  @Column({ type: 'datetime' })
  startTime: Date;

  /** 当前页面的访问结束时间 */
  @Column({ type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ nullable: true })
  prePageId: number;

  /** 上一个页面，如果是入口页面则没有该值 */
  @OneToOne(type => Page)
  @JoinColumn({ name: 'prePageId' })
  prePage: Page;

  /** 当前页面下请求的资源 */
  @OneToMany(type => Asset, asset => asset.page)
  assets?: Asset[];

  /** 访问的网站 */
  @Column() hostId: number;

  /** 关联会话 */
  @Column() sessionId: number;

  /**
   * JoinColumn
   */

  @ManyToOne(type => Session)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;
}
