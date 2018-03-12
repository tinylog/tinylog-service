import { MigrationInterface, QueryRunner } from 'typeorm';

export class Update1520833483738 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `visiter` DROP COLUMN `location`');
    await queryRunner.query('ALTER TABLE `visiter` ADD `region` varchar(255) NOT NULL');
    await queryRunner.query('ALTER TABLE `visiter` ADD `country` varchar(255) NOT NULL');
    await queryRunner.query('ALTER TABLE `visiter` ADD `ll` json NOT NULL');
    await queryRunner.query('ALTER TABLE `visiter` ADD `range` json NOT NULL');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_3b8c31625c102e69e9ba2563a6f`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_44c49cb9fa857c96310cc304a4f`');
    await queryRunner.query('ALTER TABLE `page` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `page` ADD PRIMARY KEY (`id`, `visiterId`)');
    await queryRunner.query('ALTER TABLE `page` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `page` ADD PRIMARY KEY (`id`, `hostId`)');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_877c8bfeaa7212ecd08b046a983`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_8fca349ca0e1e30be543a8fd5e5`');
    await queryRunner.query('ALTER TABLE `asset` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `asset` ADD PRIMARY KEY (`id`, `hostId`)');
    await queryRunner.query('ALTER TABLE `asset` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `asset` ADD PRIMARY KEY (`id`, `visiterId`)');
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `FK_44c49cb9fa857c96310cc304a4f` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `FK_3b8c31625c102e69e9ba2563a6f` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `FK_877c8bfeaa7212ecd08b046a983` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `FK_8fca349ca0e1e30be543a8fd5e5` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_8fca349ca0e1e30be543a8fd5e5`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_877c8bfeaa7212ecd08b046a983`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_3b8c31625c102e69e9ba2563a6f`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_44c49cb9fa857c96310cc304a4f`');
    await queryRunner.query('ALTER TABLE `asset` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `asset` ADD PRIMARY KEY (`id`, `visiterId`, `hostId`)');
    await queryRunner.query('ALTER TABLE `asset` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `asset` ADD PRIMARY KEY (`id`, `visiterId`, `hostId`)');
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `FK_8fca349ca0e1e30be543a8fd5e5` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `FK_877c8bfeaa7212ecd08b046a983` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT'
    );
    await queryRunner.query('ALTER TABLE `page` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `page` ADD PRIMARY KEY (`id`, `hostId`, `visiterId`)');
    await queryRunner.query('ALTER TABLE `page` DROP PRIMARY KEY');
    await queryRunner.query('ALTER TABLE `page` ADD PRIMARY KEY (`id`, `hostId`, `visiterId`)');
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `FK_44c49cb9fa857c96310cc304a4f` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `FK_3b8c31625c102e69e9ba2563a6f` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT'
    );
    await queryRunner.query('ALTER TABLE `visiter` DROP COLUMN `range`');
    await queryRunner.query('ALTER TABLE `visiter` DROP COLUMN `ll`');
    await queryRunner.query('ALTER TABLE `visiter` DROP COLUMN `country`');
    await queryRunner.query('ALTER TABLE `visiter` DROP COLUMN `region`');
    await queryRunner.query('ALTER TABLE `visiter` ADD `location` varchar(255) NOT NULL');
  }
}
