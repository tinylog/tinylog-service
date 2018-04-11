import * as faker from 'faker';
import { DataGenerator } from '../utils/DataGenerator';

const delay = (time: number) => new Promise(resolve => setTimeout(() => resolve(), time));

(async () => {
  await DataGenerator.connectToCurrent();
  for (;;) {
    // 每 0-480 秒就有一个会话建立
    await delay(faker.random.number({ min: 0, max: 480000 }));
    DataGenerator.ping().catch(e => e);
  }
})();
