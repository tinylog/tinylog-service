import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1522143657878 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `os`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `browserName` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `browserVersion` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `deviceType` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `deviceVendor` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `deviceModel` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `engineName` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `engineVersion` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `osName` varchar(255)');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `osVersion` varchar(255)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `osVersion`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `osName`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `engineVersion`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `engineName`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `deviceModel`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `deviceVendor`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `deviceType`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `browserVersion`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `browserName`');
    await queryRunner.query(
      'ALTER TABLE `tinylog`.`session` ADD `os` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL'
    );
  }
}
