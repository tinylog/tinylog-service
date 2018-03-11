import 'mocha';
import '../src/utils/env';
import { getConnection } from 'typeorm';

before('before all', async () => {
  const { connection } = await import('../src/index');
  await connection;
});

after('after all', async () => {
  await getConnection().close();
});
