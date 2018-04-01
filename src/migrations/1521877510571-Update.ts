import { MigrationInterface, QueryRunner, getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/UserRepository';
import { HostRepository } from '../repositories/HostRepository';
import { SHA256 } from 'crypto-js';

export class Update1521877510571 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `ip_stats` (`ip` varchar(36) NOT NULL, `region` varchar(255), `country` varchar(255), `ll` json, `range` json, `city` varchar(255), PRIMARY KEY(`ip`)) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `user` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `email` varchar(255) NOT NULL, `password` varchar(255) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `host` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `timezone` varchar(255) NOT NULL, `website` varchar(255) NOT NULL, `userId` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `session` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `ip` varchar(36) NOT NULL, `hostId` int(11) NOT NULL, `referrer` varchar(255) NOT NULL, `ua` varchar(255) NOT NULL, `os` varchar(255) NOT NULL, `lang` varchar(255) NOT NULL, `createdAt` datetime NOT NULL, `fingerprint` varchar(255) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `page` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `url` varchar(255) NOT NULL, `referrer` varchar(255) NOT NULL, `loadPage` int(11) NOT NULL, `domReady` int(11) NOT NULL, `redirect` int(11) NOT NULL, `lookupDomain` int(11) NOT NULL, `ttfb` int(11) NOT NULL, `request` int(11) NOT NULL, `tcp` int(11) NOT NULL, `loadEvent` int(11) NOT NULL, `startTime` datetime NOT NULL, `endTime` datetime, `exitTime` datetime, `prePageId` int(11), `hostId` int(11) NOT NULL, `sessionId` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'CREATE TABLE `asset` (`id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT, `name` varchar(255) NOT NULL, `entryType` varchar(255) NOT NULL, `initiatorType` int(11) NOT NULL, `redirect` int(11) NOT NULL, `lookupDomain` int(11) NOT NULL, `request` int(11) NOT NULL, `duration` int(11) NOT NULL, `sessionId` int(11) NOT NULL, `hostId` int(11) NOT NULL, `pageId` int(11) NOT NULL) ENGINE=InnoDB'
    );
    await queryRunner.query(
      'ALTER TABLE `host` ADD CONSTRAINT `fk_d4e5f9e4c9dac2386cbe09ce3fb` FOREIGN KEY (`userId`) REFERENCES `user`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `fk_46079a154968b1f3e79ecedc938` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `fk_d0f5363fe6f5be9b41f68073ef2` FOREIGN KEY (`ip`) REFERENCES `ip_stats`(`ip`)'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `fk_b97c972898b26c61047624acfb1` FOREIGN KEY (`prePageId`) REFERENCES `page`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `fk_87e084a4a81bcd06753d911438d` FOREIGN KEY (`sessionId`) REFERENCES `session`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `page` ADD CONSTRAINT `fk_a509ad556d7e50d59f27bff2209` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_46ff200041345cee3b874f9b51f` FOREIGN KEY (`sessionId`) REFERENCES `session`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_dfd977ac482ff314d9375561897` FOREIGN KEY (`hostId`) REFERENCES `host`(`id`)'
    );
    await queryRunner.query(
      'ALTER TABLE `asset` ADD CONSTRAINT `fk_f122986f41c08b338cec28a6f90` FOREIGN KEY (`pageId`) REFERENCES `page`(`id`)'
    );

    const [userRepository, hostRepository] = await Promise.all([
      getCustomRepository(UserRepository),
      getCustomRepository(HostRepository)
    ]);
    const user = await userRepository.save(
      userRepository.create({
        email: 'admin@tinylog.com',
        password: SHA256('12345678').toString()
      })
    );

    await hostRepository.save(
      hostRepository.create({
        timezone: 'Asia/Shanghai',
        website: 'https://www.qq.com',
        userId: user.id
      } as {})
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_f122986f41c08b338cec28a6f90`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_dfd977ac482ff314d9375561897`');
    await queryRunner.query('ALTER TABLE `asset` DROP FOREIGN KEY `fk_46ff200041345cee3b874f9b51f`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `fk_a509ad556d7e50d59f27bff2209`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `fk_87e084a4a81bcd06753d911438d`');
    await queryRunner.query('ALTER TABLE `page` DROP FOREIGN KEY `fk_b97c972898b26c61047624acfb1`');
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `fk_d0f5363fe6f5be9b41f68073ef2`');
    await queryRunner.query('ALTER TABLE `session` DROP FOREIGN KEY `fk_46079a154968b1f3e79ecedc938`');
    await queryRunner.query('ALTER TABLE `host` DROP FOREIGN KEY `fk_d4e5f9e4c9dac2386cbe09ce3fb`');
    await queryRunner.query('DROP TABLE `asset`');
    await queryRunner.query('DROP TABLE `page`');
    await queryRunner.query('DROP TABLE `session`');
    await queryRunner.query('DROP TABLE `host`');
    await queryRunner.query('DROP TABLE `user`');
    await queryRunner.query('DROP TABLE `ip_stats`');
  }
}
