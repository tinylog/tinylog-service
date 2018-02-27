import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Page {
  @PrimaryGeneratedColumn() id: number;

  /** */
}
