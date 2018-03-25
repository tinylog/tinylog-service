import 'mocha';
import * as assert from 'power-assert';
import * as request from 'supertest';
import * as faker from 'faker';
import { Test } from '../../src/utils/Test';

const email = faker.internet.email();
const password = faker.internet.password();

describe('UserController', () => {
  it('注册用户', async () => {
    const res = await request(Test.Instance.app)
      .post('/user/register')
      .send({
        email,
        password
      });
    assert(Reflect.has(res.body, 'id'));
    assert(Reflect.has(res.body, 'email'));
    assert(Reflect.has(res.body, 'xsrfToken'));
  });

  it('注册用户，重复注册，已被注册', async () => {
    const res = await request(Test.Instance.app)
      .post('/user/register')
      .send({
        email,
        password
      });
    assert(res.status === 400);
  });

  it('登录', async () => {
    const res = await request(Test.Instance.app)
      .post('/user/login')
      .send({
        email,
        password
      });
    assert(res.status === 200);
    assert(Reflect.has(res.body, 'id'));
    assert(Reflect.has(res.body, 'email'));
    assert(Reflect.has(res.body, 'xsrfToken'));
  });

  it('登录，邮箱不存在', async () => {
    const res = await request(Test.Instance.app)
      .post('/user/login')
      .send({
        email: faker.internet.email(),
        password
      });
    assert(res.status === 400);
    assert(res.body.message === '邮箱不存在');
  });

  it('登录，密码错误', async () => {
    const res = await request(Test.Instance.app)
      .post('/user/login')
      .send({
        email,
        password: faker.internet.password()
      });
    assert(res.status === 400);
    assert(res.body.message === '密码错误');
  });
});
