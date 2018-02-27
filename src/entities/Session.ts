import { Column, Entity, PrimaryColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import Visiter from './Visiter';
import Host from './Host';

@Entity()
export default class Session {
  @PrimaryColumn() visiterId: number;

  @PrimaryColumn() hostId: number;

  /** referer */
  @Column() referer: string;

  /** 访问时间 */
  @CreateDateColumn() createdAt: string;

  @ManyToOne(type => Visiter)
  @JoinColumn({ name: 'visiterId' })
  visiter: Visiter;

  @ManyToOne(type => Host)
  @JoinColumn({ name: 'hostId' })
  host: Host;
}
