import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import Visiter from './Visiter';
import Host from './Host';

@Entity()
export default class Connection {
  @PrimaryGeneratedColumn() id: number;

  /** 请求文件 */
  @Column() asset: string;

  /** 请求方法 */
  @Column() method: string;

  /** 状态 */
  @Column() status: number;

  /** 文件地址 */
  @Column() uri: string;

  /** 文件大小 */
  @Column() size: string;

  /** 访客 ID */
  @Column() visiterId: number;

  @ManyToOne(type => Visiter)
  @JoinColumn({ name: 'visiterId' })
  visiter: Visiter;

  /** 访问的网站 */
  @Column() hostId: number;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;
}
