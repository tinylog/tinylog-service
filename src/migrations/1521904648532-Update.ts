import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1521904648532 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP `exitTime`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP `endTime`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP `startTime`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` ADD `endAt` datetime');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` ADD `createdAt` datetime NOT NULL');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` ADD `endAt` datetime');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP `endAt`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP `createdAt`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP `endAt`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` ADD `startTime` datetime NOT NULL');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` ADD `endTime` datetime');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` ADD `exitTime` datetime');
  }
}
