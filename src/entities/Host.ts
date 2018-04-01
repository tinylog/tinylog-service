import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class Host {
  @PrimaryGeneratedColumn() id: number;

  /** 时区，PV UV 计算需要 */
  @Column() timezone: string;

  /** 网站 */
  @Column() domain: string;

  @CreateDateColumn({ type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedAt: Date;

  /**
   * 删除时间
   */
  @Column({ type: 'datetime', nullable: true })
  deletedAt: Date | null;

  /** 所属用户 ID */
  @Column() userId: number;

  /** 所属用户 */
  @OneToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
