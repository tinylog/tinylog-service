import { DataGenerator } from '../utils/DataGenerator';

(async () => {
  await DataGenerator.connect();
  let n = 5;
  while (n--) {
    await Promise.all([
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping(),
      DataGenerator.ping()
    ]).catch(e => console.log(e));
  }
  process.exit(0);
})();
