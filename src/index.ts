import 'reflect-metadata';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as config from 'config';
import { useContainer as useContainerForRoute, useKoaServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as useContainerForOrm } from 'typeorm';
import { database } from './libraries/database';
import docGenerator from 'routing-controllers-openapi-v3';

const { port } = config;

useContainerForRoute(Container);
useContainerForOrm(Container);

const app = new Koa();

app.use(logger());

useKoaServer(app, {
  cors: true,
  routePrefix: '/v1',
  controllers: [`${__dirname}/controllers/*.{js,ts}`],
  defaultErrorHandler: true
});

export const connection = database().then(async c => {
  return new Promise(resolve => {
    app.listen(port, async () => {
      console.log(`[APP] Listen on ${port} in ${config.env} enviroment`);
      await docGenerator(getMetadataArgsStorage(), {
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
        ]
      });
      console.log('Swagger Document Generated Success!');
      resolve(app.callback());
    });
  });
});
