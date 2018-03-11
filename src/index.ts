import 'reflect-metadata';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as config from 'config';
import { useContainer as useContainerForRoute, useKoaServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as useContainerForOrm } from 'typeorm';
import Database from './libraries/Database';
import Cache from './libraries/Cache';
import docGenerator from 'routing-controllers-openapi-v3';
import { IDefaultSuccessResponse } from './interfaces/Helper';

const { port } = config;

useContainerForRoute(Container);
useContainerForOrm(Container);

const app = new Koa();

app.use(logger());

useKoaServer(app, {
  cors: true,
  routePrefix: '/',
  controllers: [`${__dirname}/controllers/*.{js,ts}`],
  defaultErrorHandler: true
});

Cache.Instance.on('connect', () => console.log('[REDIS] Redis Connected'));
Cache.Instance.on('disconnect', () => console.log('[REDIS] Redis Disconnected'));
Cache.Instance.on('error', (e: Error) => console.log('[REDIS] Redis Error', e));

export const connection = Database.Instance.then(async c => {
  return new Promise(resolve => {
    app.listen(port, async () => {
      console.log(`[APP] Listen on ${port} in ${config.env} enviroment`);
      server = app.callback();
      resolve(app.callback());
    });
  });
});

if (['production', 'test'].includes(config.env)) {
  docGenerator(getMetadataArgsStorage(), {
    info: {
      title: 'TinyLog-Service API',
      description: 'API Document for TinyLog',
      version: '0.1.0'
    },
    servers: [
      {
        url: 'https://api.example.com/v1',
        description: 'test'
      }
    ],
    defaultSuccessResponse: IDefaultSuccessResponse
  }).then(() => {
    console.log('OpenAPI Document Generated Success!');
  });
}

// For supertest
export let server: any;
