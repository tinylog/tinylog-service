import { Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import User from './User';

@Entity()
export default class Host {
  @PrimaryGeneratedColumn() id: number;

  /** 网站 */
  @Column() website: string;

  /** 所属用户 ID */
  @Column() userId: number;

  /** 所属用户 */
  @OneToOne(type => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}