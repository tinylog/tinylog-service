import 'reflect-metadata';
import './env';
import * as faker from 'faker';
import { AssetRepository } from '../repositories/AssetRepository';
import { HostRepository } from '../repositories/HostRepository';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import { UserRepository } from '../repositories/UserRepository';
import { getConnection, getManager, getCustomRepository, EntityManager } from 'typeorm';
import { Asset } from '../entities/Asset';
import { Page } from '../entities/Page';

// This flag is to make app listen in an random port
process.env.__DEBUG__ = 'true';

export class Test {
  private static instance: Test;
  manager: EntityManager;
  assetRepository: AssetRepository;
  hostRepository: HostRepository;
  pageRepository: PageRepository;
  sessionRepository: SessionRepository;
  userRepository: UserRepository;
  app: any;

  private constructor() {}

  static get Instance(): Test {
    return this.instance || (this.instance = new this());
  }

  async close(): Promise<void> {
    await getConnection().close();
  }

  async connectToCurrent(): Promise<void> {
    const { Database } = await import('../libraries/Database');
    const { cache } = await import('../libraries/cache');
    this.app = process.env.NODE_ENV === 'production' ? process.env.API_HOST : 'localhost:8080';
    await Promise.all([Database.Instance, cache]);
    await this.setCustomRepository();
  }

  async connect(): Promise<void> {
    const { connection } = await import('../index');
    this.app = await connection;
    await this.setCustomRepository();
  }

  async setCustomRepository(): Promise<void> {
    this.manager = getManager();
    this.assetRepository = getCustomRepository(AssetRepository);
    this.pageRepository = getCustomRepository(PageRepository);
    this.sessionRepository = getCustomRepository(SessionRepository);
    this.userRepository = getCustomRepository(UserRepository);
    this.hostRepository = getCustomRepository(HostRepository);
  }

  mockAsset(data?: Partial<Asset>): Partial<Asset> {
    return {
      name: faker.internet.url(),
      entryType: faker.lorem.word(),
      initiatorType: faker.random.number(1000),
      redirect: faker.random.number(1000),
      lookupDomain: faker.random.number(1000),
      request: faker.random.number(1000),
      duration: faker.random.number(1000),
      ...data
    };
  }

  mockPage(data?: Partial<Page>): Partial<Page> {
    return {
      url: faker.internet.url(),
      referrer: faker.internet.url(),
      loadPage: faker.random.number(1000),
      domReady: faker.random.number(1000),
      redirect: faker.random.number(1000),
      lookupDomain: faker.random.number(1000),
      ttfb: faker.random.number(1000),
      request: faker.random.number(1000),
      tcp: faker.random.number(1000),
      loadEvent: faker.random.number(1000),
      createdAt: faker.date.past(),
      ...data
    };
  }
}
