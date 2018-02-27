import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export default class Visiter {
  @PrimaryGeneratedColumn() id: number;

  /** 语言 */
  @Column() lang: string;

  /** 地区 */
  @Column() location: string;

  /** 城市 */
  @Column() city: string;

  /** 浏览器信息 */
  @Column() browser: string;

  /** 操作系统 */
  @Column() os: string;

  /** 创建时间 */
  @CreateDateColumn() createdAt: string;
}
