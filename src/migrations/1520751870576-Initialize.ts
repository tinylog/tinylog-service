import { MigrationInterface, QueryRunner, getCustomRepository } from 'typeorm';
import HostRepository from '../repositories/HostRepository';
import UserRepository from '../repositories/UserRepository';
import { SHA256 } from 'crypto-js';

export class Initialize1520751870576 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `visiter` (`id` varchar(36) NOT NULL, `lang` varchar(255) NOT NULL, `location` varchar(255) NOT NULL, `city` varchar(255) NOT NULL, `ip` varchar(255) NOT NULL, `ua` varchar(255) NOT NULL, `os` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `user` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `host` (`id` varchar(36) NOT NULL, `website` varchar(255) NOT NULL, `userId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `page` (`id` varchar(36) NOT NULL, `url` varchar(255) NOT NULL, `referrer` varchar(255) NOT NULL, `loadPage` int(11) NOT NULL, `domReady` int(11) NOT NULL, `redirect` int(11) NOT NULL, `lookupDomain` int(11) NOT NULL, `ttfb` int(11) NOT NULL, `request` int(11) NOT NULL, `tcp` int(11) NOT NULL, `loadEvent` int(11) NOT NULL, `startTime` int(11) NOT NULL, `endTime` int(11) NOT NULL, `exitTime` int(11), `prePageId` varchar(36) NOT NULL, `hostId` varchar(36) NOT NULL, `visiterId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `asset` (`id` varchar(36) NOT NULL, `name` varchar(255) NOT NULL, `entryType` varchar(255) NOT NULL, `initiatorType` int(11) NOT NULL, `redirect` int(11) NOT NULL, `lookupDomain` int(11) NOT NULL, `request` int(11) NOT NULL, `duration` int(11) NOT NULL, `visiterId` varchar(36) NOT NULL, `hostId` varchar(36) NOT NULL, `pageId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `session` (`visiterId` varchar(36) NOT NULL, `hostId` varchar(36) NOT NULL, `referrer` varchar(255) NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`visiterId`, `hostId`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `host` ADD CONSTRAINT `FK_2f0ee47b94c3cf61a7bf4716a67` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `FK_0121b3aefede1141f28beeacb58` FOREIGN KEY (`prePageId`) REFERENCES `page`(`id`)'
    );
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
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `FK_b03a2e6d5eafb05a99f26e3efdf` FOREIGN KEY (`pageId`) REFERENCES `page`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_c09912fa4d5afd6d5fdbfe87a75` FOREIGN KEY (`visiterId`) REFERENCES `visiter`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_f87d0e39c746e717783510f20f2` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );

    const userRepository = getCustomRepository(UserRepository);
    const hostRepository = getCustomRepository(HostRepository);
    const user = await userRepository.save(
      userRepository.create({
        email: 'qq@qq.com',
        password: SHA256('qqqqqqqq').toString()
      })
    );
    await hostRepository.save(
      hostRepository.create({
        website: 'https://www.qq.com',
        user
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_f87d0e39c746e717783510f20f2`');
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `FK_c09912fa4d5afd6d5fdbfe87a75`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_b03a2e6d5eafb05a99f26e3efdf`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_8fca349ca0e1e30be543a8fd5e5`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `FK_877c8bfeaa7212ecd08b046a983`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_3b8c31625c102e69e9ba2563a6f`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_44c49cb9fa857c96310cc304a4f`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `FK_0121b3aefede1141f28beeacb58`');
    await queryRunner.query('ALTER TABLE `host` DROP FOREIGN KEY `FK_2f0ee47b94c3cf61a7bf4716a67`');
    await queryRunner.query('DROP TABLE `session`');
    await queryRunner.query('DROP TABLE `asset`');
    await queryRunner.query('DROP TABLE `page`');
    await queryRunner.query('DROP TABLE `host`');
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `visiter`');
  }
}
