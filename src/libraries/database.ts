import 'reflect-metadata';
import * as config from 'config';
import * as path from 'path';
import { Connection, createConnection } from 'typeorm';

const dbConfig = config.database;

const root = path.resolve(__dirname, '..');
const entityPath = `${root}/entities/*.{js,ts}`;
const migrationPath = `${root}/migrations/*.{js,ts}`;

export const database: () => Promise<Connection> = async () =>
  createConnection({
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
  }).then(c => {
    console.log('[DB] Database Connected');
    return c;
  });
