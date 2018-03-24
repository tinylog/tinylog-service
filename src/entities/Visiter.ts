import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export default class Visiter {
  @PrimaryGeneratedColumn() id: number;

  /** 语言 */
  @Column() lang: string;

  /** 地区 */
  @Column({ nullable: true })
  region?: string;

  /** 国家 */
  @Column({ nullable: true })
  country?: string;

  /** LL */
  @Column('json', { nullable: true })
  ll?: string[];

  /** range */
  @Column('json', { nullable: true })
  range?: string[];

  /** 城市 */
  @Column({ nullable: true })
  city?: string;

  /** IP 地址 */
  @Column() ip: string;

  /** 浏览器信息 */
  @Column() ua: string;

  /** 操作系统 */
  @Column() os: string;

  /** 创建时间 */
  @CreateDateColumn() createdAt: string;
}
