import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export default class Visiter {
  @PrimaryGeneratedColumn('uuid') id: string;

  /** 语言 */
  @Column() lang: string;

  /** 地区 */
  @Column() region: string;

  /** 国家 */
  @Column() country: string;

  /** LL */
  @Column('json') ll: string[];

  /** range */
  @Column('json') range: string[];

  /** 城市 */
  @Column() city: string;

  /** IP 地址 */
  @Column() ip: string;

  /** 浏览器信息 */
  @Column() ua: string;

  /** 操作系统 */
  @Column() os: string;

  /** 创建时间 */
  @CreateDateColumn() createdAt: string;
}
