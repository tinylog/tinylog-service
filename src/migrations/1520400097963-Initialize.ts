import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1520400097963 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `visiter` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `lang` varchar(255) NOT NULL, `location` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `ip` varchar(255) NOT NULL, `ua` varchar(255) NOT NULL, `os` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `user` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `host` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `website` varchar(255) NOT NULL, `userId` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `page` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `url` varchar(255) NOT NULL, `totalTime` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `asset` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(255) NOT NULL, `entryType` varchar(255) NOT NULL, `initiatorType` int(11) NOT NULL, `status` int(11) NOT NULL, `type` varchar(255) NOT NULL, `size` int(11) NOT NULL, `time` int(11) NOT NULL, `waterfall` json NOT NULL, `redirect` int(11) NOT NULL, `lookupDomain` int(11) NOT NULL, `request` int(11) NOT NULL, `duration` int(11) NOT NULL, `visiterId` int(11) NOT NULL, `hostId` int(11) NOT NULL, `pageId` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `session` (`visiterId` int(11) NOT NULL, `hostId` int(11) NOT NULL, `referer` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY(`visiterId`, `hostId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `host` ADD CONSTRAINT `fk_d4e5f9e4c9dac2386cbe09ce3fb` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_70e696de7adba63cf53b35b702b` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_dfd977ac482ff314d9375561897` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_f122986f41c08b338cec28a6f90` FOREIGN KEY (`pageId`) REFERENCES `page`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `fk_ff52a173445bb5b2042555049bb` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `fk_46079a154968b1f3e79ecedc938` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `fk_46079a154968b1f3e79ecedc938`');
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `fk_ff52a173445bb5b2042555049bb`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_f122986f41c08b338cec28a6f90`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_dfd977ac482ff314d9375561897`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_70e696de7adba63cf53b35b702b`');
    await queryRunner.query('ALTER TABLE `host` DROP FOREIGN KEY `fk_d4e5f9e4c9dac2386cbe09ce3fb`');
    await queryRunner.query('DROP TABLE `session`');
    await queryRunner.query('DROP TABLE `asset`');
    await queryRunner.query('DROP TABLE `page`');
    await queryRunner.query('DROP TABLE `host`');
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `visiter`');
  }
}
