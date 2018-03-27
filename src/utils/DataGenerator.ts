/**
 * 生成测试数据，需要的时候运行
 */

import { Test } from './Test';
import * as request from 'supertest';
import * as faker from 'faker';
import { Host } from '../entities/Host';
import * as moment from 'moment';

class DataGenerator {
  static host: Host;

  static async connect() {
    await Test.Instance.connect();
    this.host = await Test.Instance.hostRepository.findOne();
  }

  /**
   * 一连串随机请求
   */
  static async fake() {
    // 随机一个伪造时间
    let date = faker.date.recent(30).toISOString();
    const url = (suffix: string = '') => this.host.website + '/' + faker.lorem.word() + suffix;

    // 会话 start
    const initializeRes = await request(Test.Instance.app)
      .post('/log/initialize')
      .send({
        referrer: faker.internet.url(),
        lang: ['zh-cn', 'en', 'ru'][faker.random.number({ min: 0, max: 2 })],
        host: this.host.website,
        ua: faker.internet.userAgent(),
        os: ['windows', 'linux', 'mac'][faker.random.number({ min: 0, max: 2 })],
        fingerprint: faker.internet.mac(),
        createdAt: date
      });

    const token = initializeRes.body.token;

    // 首屏数据
    const pageRes = await request(Test.Instance.app)
      .post('/log/page')
      .set('authorization', token)
      .send(
        Test.Instance.mockPage({
          url: url(),
          createdAt: new Date(date)
        })
      );

    let pageId = pageRes.body.pageId;

    // 首屏资源数据
    await request(Test.Instance.app)
      .post('/log/assets')
      .set('authorization', token)
      .send({
        pageId,
        assets: new Array(10).fill(undefined).map(i =>
          Test.Instance.mockAsset({
            name: url()
          })
        )
      });

    // 继续浏览其他页面

    // 继续浏览 n 页
    let n = faker.random.number({ min: 0, max: 6 });

    // 会话退出
    while (n--) {
      // 逗留 1-60 秒
      date = moment(date)
        .add(faker.random.number({ min: 1, max: 60 }), 's')
        .format();

      const newAssetsRes = await request(Test.Instance.app)
        .post('/log/page')
        .set('authorization', token)
        .send(
          Test.Instance.mockPage({
            prePageId: pageId,
            url: url(),
            createdAt: new Date(date)
          })
        );

      pageId = newAssetsRes.body.pageId;

      await request(Test.Instance.app)
        .post('/log/assets')
        .set('authorization', token)
        .send({
          pageId,
          assets: new Array(faker.random.number({ min: 1, max: 3 })).fill(undefined).map(i =>
            Test.Instance.mockAsset({
              name: url()
            })
          )
        });
    }

    // 逗留 1-60 秒
    date = moment(date)
      .add(faker.random.number({ min: 1, max: 60 }), 's')
      .format();

    await request(Test.Instance.app)
      .post('/log/exit')
      .set('authorization', token)
      .send({
        pageId,
        exitTime: date
      });
  }
}

(async () => {
  await DataGenerator.connect();
  let n = 50;
  while (n--) {
    await Promise.all([
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake(),
      DataGenerator.fake()
    ]);
  }
  process.exit(0);
})();
