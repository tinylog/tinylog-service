// import 'reflect-metadata';
// import * as path from 'path';
// import * as config from 'config';
// import { createConnection, Connection } from 'typeorm';

// const dbConfig = config.database;

// const root = path.resolve(__dirname, '..');
// const entityPath = `${root}/entities/*.{js,ts}`;
// const migrationPath = `${root}/migrations/*.{js,ts}`;

// export const database: Promise<Connection> = createConnection({
//   type: 'mysql',
//   name: 'default',
//   host: dbConfig.host,
//   port: dbConfig.port,
//   username: dbConfig.username,
//   password: dbConfig.password,
//   database: dbConfig.name,
//   entities: [entityPath],
//   migrations: [migrationPath],
//   migrationsRun: true,
//   cli: {
//     migrationsDir: path.resolve(__dirname, '..', 'migrations')
//   },
//   charset: 'utf8mb4_general_ci',
//   logging: dbConfig.logging
// })
//   .then(c => {
//     console.log('[MySQL] MySQL Connected');
//     return c;
//   })
//   .catch(e => {
//     throw e;
//   });

import 'reflect-metadata';
import * as path from 'path';
import * as config from 'config';
import { createConnection, Connection } from 'typeorm';

const dbConfig = config.database;

const root = path.resolve(__dirname, '..');
const entityPath = `${root}/entities/*.{js,ts}`;
const migrationPath = `${root}/migrations/*.{js,ts}`;

export class Database {
  private static instance: any;

  private constructor() {
    return createConnection({
      type: 'mysql',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.name,
      entities: [entityPath],
      migrations: [migrationPath],
      migrationsRun: true,
      cli: {
        migrationsDir: path.resolve(__dirname, '..', 'migrations')
      },
      charset: 'utf8mb4_general_ci',
      logging: dbConfig.logging
    });
  }

  public static get Instance(): Promise<Connection> {
    return this.instance || (this.instance = new this());
  }
}
