import { Context } from 'koa';
import * as faker from 'faker';

/**
 * 每个请求生成随机的 IP 地址
 */
export function debug() {
  return async (ctx: Context, next: () => Promise<{}>) => {
    ctx.request.ip = faker.internet.ip();
    await next();
  };
}
