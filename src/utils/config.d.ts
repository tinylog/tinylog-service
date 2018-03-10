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

  export const env: string;
  export const port: number;
}
