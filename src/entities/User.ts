import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn() id: number;

  /** 用户邮箱 */
  @Column() email: string;

  /** 用户密码 */
  @Exclude()
  @Column()
  password: string;
}
