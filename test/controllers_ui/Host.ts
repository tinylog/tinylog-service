import 'mocha';
import * as assert from 'power-assert';
import * as request from 'supertest';
import * as faker from 'faker';
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

  it('获取网站基本数据信息', async () => {
    const res = await request(Test.Instance.app)
      .get(`/host/${host.id}/pvuv`)
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
  });
});
