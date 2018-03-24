import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Session from './Session';
import Host from './Host';
import Page from './Page';

@Entity()
export default class Asset {
  @PrimaryGeneratedColumn() id: number;

  /** 请求文件 */
  @Column() name: string;

  /** 请求的类型 */
  @Column() entryType: string;

  /** 资源类型 */
  @Column() initiatorType: number;

  /** 重定向的时间 */
  @Column() redirect: number;

  /** DNS 查询时间 */
  @Column() lookupDomain: number;

  /** 资源完成加载的时间 */
  @Column() request: number;

  /** 资源的耗时 */
  @Column() duration: number;

  /** 会话 ID */
  @Column() sessionId: number;

  /** 访问的网站 */
  @Column() hostId: number;

  /** 所属的页面 */
  @Column() pageId: number;

  /**
   * JoinColumn
   */

  @ManyToOne(type => Session)
  @JoinColumn({ name: 'sessionId' })
  session: Session;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;

  @ManyToOne(type => Page)
  @JoinColumn({ name: 'pageId' })
  page: Page;
}
