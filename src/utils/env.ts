/**
 * @file 处理 config 中的环境变量
 */

import * as config from 'config';

interface IConfig {
  [index: string]: string | number | undefined | IConfig;
}

const transform = (obj: IConfig): void => {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      if (/^ENV:/.test(obj[key] as string)) {
        obj[key] = process.env[(obj[key] as string).split(':')[1]];
      }
    } else {
      transform(obj[key] as IConfig);
    }
  }
};

transform(config as {});
