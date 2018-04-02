import 'mocha';
import * as assert from 'power-assert';
import * as request from 'supertest';
import { Test } from '../../src/utils/Test';
import { Host } from '../../src/entities/Host';

let host: Host;
let xsrfToken: string;
let token: string;

describe('RealTimeController', () => {
  before(async () => {
    host = (await Test.Instance.hostRepository.findOne())!;

    const res = await request(Test.Instance.app)
      .post('/user/login')
      .send({
        email: 'admin@tinylog.com',
        password: '12345678'
      });

    xsrfToken = res.body.xsrfToken;
    token = res.body.token; // IN PRODUCTION ENV, THIS TOKEN WON'T RETURN
  });

  it('获取实时会话数据', async () => {
    const res = await request(Test.Instance.app)
      .get(`/realtime/${host.id}/overview`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken);
    assert(typeof res.body.count === 'number');
    assert(Array.isArray(res.body.referrer));
  });

  it('获取实时页面数据', async () => {
    const res = await request(Test.Instance.app)
      .get(`/realtime/${host.id}/page`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken);
    assert(Array.isArray(res.body));
    assert(res.body[0].url);
    assert(typeof res.body[0].count === 'number');
  });

  it('获取近三十分钟会话数的分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/realtime/${host.id}/vv`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken);
    assert(Array.isArray(res.body));
    assert(typeof res.body[0].vv === 'number');
  });
});
