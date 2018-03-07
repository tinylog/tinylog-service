import 'reflect-metadata';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as config from 'config';
import { useContainer as useContainerForRoute, useKoaServer } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as useContainerForOrm } from 'typeorm';
import { database } from './libraries/database';

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
      await import('./utils/doc').then(() => console.log('[Swagger] Document generated success!'));
      process.exit(0); // TODO
      resolve(app.callback());
    });
  });
});
