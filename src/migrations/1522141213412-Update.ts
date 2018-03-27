import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1522141213412 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `region` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `country` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `city` varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `city`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `country`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `region`');
  }
}
