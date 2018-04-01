import 'mocha';
import * as assert from 'power-assert';
import * as request from 'supertest';
import { Test } from '../../src/utils/Test';
import { Host } from '../../src/entities/Host';
import * as faker from 'faker';
import * as moment from 'moment';

let xsrfToken: string;
let token: string;
let host: Host;
let newHostId: number;
const domain = faker.random.word() + '.com';

describe.only('HostController', () => {
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
      // .set('Cookie', `jwt=${token}`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken);
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'domain'));
    assert(Reflect.has(res.body[0], 'timezone'));
    assert(typeof res.body[0].id === 'number');
    assert(typeof res.body[0].userId === 'number');
  });

  it('获取网站基本数据信息', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/overview`)
      // .set('Cookie', `jwt=${token}`)
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      // .set('Cookie', `jwt=${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      // .set('Cookie', `jwt=${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      // .set('Cookie', `jwt=${token}`)
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
      // .set('Cookie', `jwt=${token}`)
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      // .set('Cookie', `jwt=${token}`)
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

  it('获取资源慢连接', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/assets/slow`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'entryType'));
    assert(Reflect.has(res.body[0], 'avgRedirect'));
  });

  it('获取页面慢连接', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/pages/slow`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .query({
        from: moment()
          .subtract(14, 'day')
          .format(),
        to: moment().format()
      });
    assert(Array.isArray(res.body));
    assert(Reflect.has(res.body[0], 'url'));
    assert(Reflect.has(res.body[0], 'avgLookupDomain'));
  });

  it('创建网站', async () => {
    const res = await request(Test.Instance.app)
      .post('/host/create')
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .send({
        domain,
        timezone: 'Asia/Shanghai'
      });
    assert(res.body.domain === domain);
    assert(res.body.timezone === 'Asia/Shanghai');
    newHostId = res.body.id;
  });

  it('重复创建网站', async () => {
    const res = await request(Test.Instance.app)
      .post('/host/create')
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .send({
        domain,
        timezone: 'Asia/Shanghai'
      });
    assert(res.status === 400);
  });

  it('更新网站', async () => {
    const res = await request(Test.Instance.app)
      .patch(`/host/${newHostId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .send({
        timezone: 'Asia/HongKong'
      });
    assert(res.status === 200);
    const host2 = await Test.Instance.hostRepository.findOneById(newHostId);
    assert(host2!.timezone === 'Asia/HongKong');
  });

  it('删除网站（Soft Delete）', async () => {
    const res = await request(Test.Instance.app)
      .delete('/host')
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .send({
        list: [newHostId]
      });
    assert(res.status === 200);
    assert(res.body.success);
  });

  it('继续创建网站（恢复软删除）', async () => {
    const res = await request(Test.Instance.app)
      .post('/host/create')
      .set('Authorization', `Bearer ${token}`)
      .set('xsrf-token', xsrfToken)
      .send({
        domain,
        timezone: 'Asia/Shanghai'
      });
    assert(res.status === 200);
    assert(res.body.id === newHostId);
    const host2 = await Test.Instance.hostRepository.findOneById(newHostId);
    assert(host2!.timezone === 'Asia/Shanghai');
  });
});
