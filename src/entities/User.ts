import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid') id: string;

  /** 用户邮箱 */
  @Column() email: string;

  /** 用户密码 */
  @Column() password: string;
}
