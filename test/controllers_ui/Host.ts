import 'mocha';
import * as assert from 'power-assert';
import * as request from 'supertest';
import { Test } from '../../src/utils/Test';
import { Host } from '../../src/entities/Host';
import * as moment from 'moment';

let xsrfToken: string;
let token: string;
let host: Host;

describe('HostController', () => {
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

  it('获取网站列表', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken);
    assert(Array.isArray(res.body));
    assert(res.body[0].timezone);
    assert(res.body[0].website);
    assert(typeof res.body[0].id === 'number');
    assert(typeof res.body[0].userId === 'number');
  });

  it('获取网站基本数据信息', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/overview`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(7, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(res.body[0].date);
    assert(typeof res.body[0].pv === 'number');
    assert(typeof res.body[0].uv === 'number');
    assert(typeof res.body[0].vv === 'number');
  });

  it('获取会话的语言分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/distribution/lang`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'lang'));
    assert(Reflect.has(res.body[0], 'count'));
  });

  it('获取会话的 referrer 分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/distribution/referrer`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'referrer'));
    assert(Reflect.has(res.body[0], 'count'));
  });

  it('获取会话的城市分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/distribution/city`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'city'));
    assert(Reflect.has(res.body[0], 'count'));
  });

  it('获取会话的地区分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/distribution/region`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'region'));
    assert(Reflect.has(res.body[0], 'count'));
  });

  it('获取会话的 ORG 分布', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/distribution/org`)
      .set('Cookie', `jwt=${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'org'));
    assert(Reflect.has(res.body[0], 'count'));
  });
});
