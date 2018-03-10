import * as config from 'config';
import * as Redis from 'ioredis';

const cacheConfig = config.cache;

export default class Cache extends Redis {
  private static instance?: Cache;

  private constructor() {
    super(cacheConfig.port, cacheConfig.host, {
      password: cacheConfig.password,
      db: cacheConfig.db
    });
  }

  public static get Instance() {
    return this.instance || (this.instance = new this());
  }
}
