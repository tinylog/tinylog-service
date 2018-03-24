declare module 'config' {
  export const database: {
    name: string;
    host: string;
    port: number;
    username: string;
    password: string;
    sync: boolean;
    logging: boolean;
  };

  export const cache: {
    host: string;
    port: number;
    db: number;
    prefix: string;
    password: string;
  };

  export const zookeeper: string;

  export const jwt: {
    secret: string;
    exp: number;
  };

  export const mq: {
    host: string;
    port: number;
  };

  export const env: string;
  export const port: number;
}
