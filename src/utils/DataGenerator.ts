/**
 * 生成测试数据，需要的时候运行
 */

import { Test } from './Test';
import * as request from 'supertest';
import * as faker from 'faker';
import { Host } from '../entities/Host';

class DataGenerator {
  static host: Host;

  static async connect() {
    await Test.Instance.connect();
    this.host = (await Test.Instance.hostRepository.findOne())!;
  }

  /**
   * 一连串随机请求
   */
  static async ping() {
    const url = (suffix: string = '') => this.host.domain + '/' + faker.lorem.word() + suffix;

    // 建立会话
    const initializeRes = await request(Test.Instance.app)
      .post('/log/initialize')
      .send({
        referrer: faker.internet.url(),
        lang: ['zh-cn', 'en', 'ru'][faker.random.number({ min: 0, max: 2 })],
        host: this.host.domain,
        ua: faker.internet.userAgent(),
        os: ['windows', 'linux', 'mac'][faker.random.number({ min: 0, max: 2 })],
        fingerprint: faker.internet.mac(),
        createdAt: new Date().toISOString()
      });
    console.log(`Start a new connection to domain: ${this.host.domain}`);

    const token = initializeRes.body.token;

    const url1 = url();
    // 首屏数据
    const pageRes = await request(Test.Instance.app)
      .post('/log/page')
      .set('authorization', token)
      .send(
        Test.Instance.mockPage({
          url: url1,
          createdAt: new Date()
        })
      );

    let pageId = pageRes.body.pageId;
    console.log(`Visit url: ${url1}`);

    // 首屏资源数据
    await request(Test.Instance.app)
      .post('/log/assets')
      .set('authorization', token)
      .send({
        pageId,
        assets: new Array(10).fill(undefined).map(i =>
          Test.Instance.mockAsset({
            name: url(['.jpg', '.png', '.js', '.css', '.webp'][faker.random.number({ min: 0, max: 4 })])
          })
        )
      });

    // 接下来准备浏览 n 个页面
    let n = faker.random.number({ min: 0, max: 6 });

    // 会话退出
    while (n--) {
      // 下个页面之前先要停留一会
      console.log(`Keep-alive connection start: ${pageId}`);

      await new Promise(resolve => {
        request(Test.Instance.app)
          .post(`/log/alive/${pageId}`)
          .set('authorization', token)
          .timeout(faker.random.number({ min: 2000, max: 8000 }))
          .then(() => resolve())
          .catch(() => resolve());
      });

      console.log(`Keep-alive connection end: ${pageId}`);

      const url2 = url();
      const newPageRes = await request(Test.Instance.app)
        .post('/log/page')
        .set('authorization', token)
        .send(
          Test.Instance.mockPage({
            prePageId: pageId,
            url: url2,
            createdAt: new Date()
          })
        );

      pageId = newPageRes.body.pageId;
      console.log(`Visit url: ${url2}`);

      await request(Test.Instance.app)
        .post('/log/assets')
        .set('authorization', token)
        .send({
          pageId,
          assets: new Array(faker.random.number({ min: 1, max: 3 })).fill(undefined).map(i =>
            Test.Instance.mockAsset({
              name: url(['.jpg', '.png', '.js', '.css', '.webp'][faker.random.number({ min: 0, max: 4 })])
            })
          )
        });
    }

    // 下个页面之前先要停留一会
    console.log(`Keep-alive connection start: ${pageId}`);

    await new Promise(resolve => {
      request(Test.Instance.app)
        .post(`/log/alive/${pageId}`)
        .set('authorization', token)
        .timeout(faker.random.number({ min: 2000, max: 8000 }))
        .then(() => resolve())
        .catch(() => resolve());
    });

    console.log(`Keep-alive connection end: ${pageId}`);
  }
}

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
    ]);
  }
  process.exit(0);
})();
