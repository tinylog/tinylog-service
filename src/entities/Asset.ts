import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Visiter from './Visiter';
import Host from './Host';
import Page from './Page';

@Entity()
export default class Asset {
  @PrimaryGeneratedColumn('uuid') id: string;

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

  /** 访客 ID */
  @Column() visiterId: string;

  /** 访问的网站 */
  @Column() hostId: string;

  /** 所属的页面 */
  @Column() pageId: string;

  @ManyToOne(type => Visiter)
  @JoinColumn({ name: 'visiterId' })
  visiter: Visiter;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;

  @ManyToOne(type => Page)
  @JoinColumn({ name: 'pageId' })
  page: Page;
}
