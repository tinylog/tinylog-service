import * as config from 'config';
import * as IORedis from 'ioredis';

let client: IORedis.Redis;

const cacheConfig = config.cache;

export const cache: Promise<IORedis.Redis> = new Promise((resolve, reject) => {
  client = new IORedis(cacheConfig.port, cacheConfig.host, {
    password: cacheConfig.password,
    db: cacheConfig.db
  });

  client.on('connect', () => {
    console.log('[REDIS] Redis Connected');
    resolve(client);
  });

  client.on('disconnect', () => {
    reject('[REDIS] Redis Disconnected');
  });

  client.on('error', (e: Error) => {
    reject(e);
  });
});

export const getCache = () => client;
