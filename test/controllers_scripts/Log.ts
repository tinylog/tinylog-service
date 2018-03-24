import 'mocha';
import * as assert from 'power-assert';
import * as faker from 'faker';
import * as request from 'supertest';
import Host from '../../src/entities/Host';
import Test from '../../src/utils/Test';
import { getCache } from '../../src/libraries/cache';

let host: Host;
let token: string;
let pageId: number;
let nextPageId: number;

describe('LogController', () => {
  before('', async () => {
    host = (await Test.Instance.hostRepository.findOne())!;
  });

  it('建立会话', async () => {
    const res = await request(Test.Instance.app)
      .post('/log/initialize')
      .send({
        referrer: 'https://ruiming.me',
        lang: 'zh-cn',
        host: host.website,
        ua: faker.internet.userAgent(),
        os: 'linux',
        fingerprint: 'test',
        createdAt: new Date().toISOString()
      });

    assert(res.status === 200);
    assert(res.body.token);
    token = res.body.token;
  });

  it('发送页面数据，没有 TOKEN', async () => {
    const res = await request(Test.Instance.app)
      .post('/log/page')
      .send(Test.Instance.mockPage());

    assert(res.status === 400);
  });

  it('正确发送页面数据', async () => {
    const res = await request(Test.Instance.app)
      .post('/log/page')
      .set('authorization', token)
      .send(
        Test.Instance.mockPage({
          url: 'https://ruiming.me'
        })
      );

    assert(res.status === 200);
    assert(res.body.pageId);
    pageId = res.body.pageId;
  });

  it('发送页面资源数据', async () => {
    const [name1, name2] = [faker.lorem.word(), faker.lorem.word()];
    const res = await request(Test.Instance.app)
      .post('/log/assets')
      .set('authorization', token)
      .send({
        pageId,
        assets: [Test.Instance.mockAsset({ name: name1 }), Test.Instance.mockAsset({ name: name2 })]
      });

    assert(res.status === 200);

    // check
    const asset1 = await Test.Instance.assetRepository.findOne({ name: name1 });
    assert(asset1);
    const asset2 = await Test.Instance.assetRepository.findOne({ name: name2 });
    assert(asset2);
  });

  it('跳转下一个页面', async () => {
    const res = await request(Test.Instance.app)
      .post('/log/page')
      .set('authorization', token)
      .send(
        Test.Instance.mockPage({
          url: 'https://ruiming.me',
          prePageId: pageId
        })
      );

    assert(res.status === 200);
    assert(res.body.pageId);
    nextPageId = res.body.pageId;
  });

  it('网页退出', async () => {
    const res = await request(Test.Instance.app)
      .post('/log/exit')
      .set('authorization', token)
      .send({
        pageId: nextPageId,
        exitTime: new Date()
      });

    assert(res.status === 200);
  });
});
