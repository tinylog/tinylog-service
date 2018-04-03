import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1522763076080 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`page` CHANGE `url` `url` varchar(36) NOT NULL');
    await queryRunner.query('ALTER TABLE `tinylog`.`asset` CHANGE `name` `name` varchar(36) NOT NULL');
    await queryRunner.query('ALTER TABLE `tinylog`.`asset` CHANGE `entryType` `entryType` varchar(36) NOT NULL');
    await queryRunner.query('CREATE INDEX `ind_b2e2bc77dec43f509fecf597d3` ON `tinylog`.`host`(`deletedAt`)');
    await queryRunner.query('CREATE INDEX `ind_ef6aa85b057aeeb8971d5efdcf` ON `tinylog`.`page`(`createdAt`)');
    await queryRunner.query('CREATE INDEX `ind_ac81b017a57bb5bc3b1ae3e0c4` ON `tinylog`.`page`(`url`)');
    await queryRunner.query('CREATE INDEX `ind_77a94a7d292dfe06876448cd3e` ON `tinylog`.`session`(`createdAt`)');
    await queryRunner.query('CREATE INDEX `ind_8cd1f9cb99d0821c3c1091734d` ON `tinylog`.`asset`(`name`, `entryType`)');
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `tinylog`.`asset` DROP INDEX `ind_8cd1f9cb99d0821c3c1091734d`');
    await queryRunner.query('ALTER TABLE `tinylog`.`session` DROP INDEX `ind_77a94a7d292dfe06876448cd3e`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP INDEX `ind_ac81b017a57bb5bc3b1ae3e0c4`');
    await queryRunner.query('ALTER TABLE `tinylog`.`page` DROP INDEX `ind_ef6aa85b057aeeb8971d5efdcf`');
    await queryRunner.query('ALTER TABLE `tinylog`.`host` DROP INDEX `ind_b2e2bc77dec43f509fecf597d3`');
    await queryRunner.query(
      'ALTER TABLE `tinylog`.`asset` CHANGE `entryType` `entryType` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `tinylog`.`asset` CHANGE `name` `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL'
    );
    await queryRunner.query(
      'ALTER TABLE `tinylog`.`page` CHANGE `url` `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL'
    );
  }
}
