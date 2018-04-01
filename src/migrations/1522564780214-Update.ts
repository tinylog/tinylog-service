import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1522564780214 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`host` ADD `createdAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6)');
    await queryRunner.query('ALTER TABLE `tinylog`.`host` ADD `updatedAt` datetime(6) DEFAULT CURRENT_TIMESTAMP(6)');
    await queryRunner.query('ALTER TABLE `tinylog`.`host` ADD `deletedAt` datetime');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`host` DROP `deletedAt`');
    await queryRunner.query('ALTER TABLE `tinylog`.`host` DROP `updatedAt`');
    await queryRunner.query('ALTER TABLE `tinylog`.`host` DROP `createdAt`');
  }
}
