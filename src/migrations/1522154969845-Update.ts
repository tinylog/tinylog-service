import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1522154969845 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` DROP `ll`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` DROP `range`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` ADD `loc` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` ADD `hostname` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` ADD `org` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `hostname` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `org` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `loc` varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `loc`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `org`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `hostname`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` DROP `org`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` DROP `hostname`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` DROP `loc`');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` ADD `range` json');
    await queryRunner.query('ALTER TABLE `tinylog`.`ip_stats` ADD `ll` json');
  }
}
