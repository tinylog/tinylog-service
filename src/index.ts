import 'reflect-metadata';
import './utils/env';
// import './libraries/sub';
import * as Koa from 'koa';
import * as logger from 'koa-logger';
import * as config from 'config';
import { useContainer as useContainerForRoute, useKoaServer, getMetadataArgsStorage } from 'routing-controllers';
import { Container } from 'typedi';
import { useContainer as useContainerForOrm } from 'typeorm';
import { Database } from './libraries/Database';
import { cache } from './libraries/cache';
import { IDefaultSuccessResponse } from './interfaces/Helper';
import { errorCatch } from './middlewares/errorCatch';
import * as jwt from 'koa-jwt';
import docGenerator from 'routing-controllers-openapi-v3';
import { debug } from './middlewares/debug';
import * as kcors from 'kcors';

const { port } = config;

useContainerForRoute(Container);
useContainerForOrm(Container);

const app = new Koa();

app.proxy = true;

app.use(
  kcors({
    credentials: true
  })
);
app.use(debug()); // for test only

app.use(logger());
app.use(errorCatch());

app.use(
  jwt({
    secret: config.jwt.secret
    // cookie: 'jwt'
  }).unless({
    path: [
      /^\/api\/log/, // ignore controller_scripts
      /^\/api\/user\/register/, // register page
      /^\/api\/user\/login/ // login page
    ]
  })
);

useKoaServer(app, {
  cors: true,
  routePrefix: '/api',
  controllers: [`${__dirname}/controllers*/*.{js,ts}`],
  defaultErrorHandler: true
});

export const connection = Promise.all([Database.Instance, cache]).then(([c]) => {
  return new Promise(resolve => {
    app.listen(process.env.__DEBUG__ ? 0 : port, async () => {
      console.log(`[APP] Listen on ${port} in ${config.env} enviroment`);
      console.log('[TinyLog] Initialize Host: https://www.qq.com');
      console.log('[TinyLog] Initialize User: admin@tinylog.com 12345678');
      resolve(app.callback());
    });
  });
});

// Create document only in development environment
if (config.env !== 'production') {
  docGenerator(getMetadataArgsStorage(), {
    info: {
      title: 'TinyLog-Service API',
      description: 'API Document for TinyLog',
      version: '0.2.0'
    },
    servers: [
      {
        url: 'https://tinylog.ruiming.me/',
        description: 'Production Server'
      }
    ],
    defaultSuccessResponse: IDefaultSuccessResponse
  }).then(() => {
    console.log('[OpenAPI] Document Generated Success');
  });
}
