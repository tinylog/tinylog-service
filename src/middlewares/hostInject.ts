import { Context } from 'koa';
import Cache from '../libraries/Cache';
import { getCustomRepository } from 'typeorm';
import HostRepository from '../repositories/HostRepository';
import { BadRequestError } from 'routing-controllers';

/**
 * 检查 Host 是否可用，可用的话注入 hostId 到 state 中
 */
export default function hostInject() {
  return async (ctx: Context, next: () => Promise<{}>) => {
    const fromHost = ctx.headers['t-host'];
    // host validate
    const cacheHostId = await Cache.Instance.get(`HOST:${fromHost}`);
    if (!cacheHostId) {
      const host = await getCustomRepository(HostRepository).findOne({
        website: fromHost
      });
      if (!host) {
        throw new BadRequestError('Request Host Not Found');
      } else {
        await Cache.Instance.set(`HOST:${fromHost}`, host.id);
        ctx.state.hostId = host.id;
      }
    } else {
      ctx.state.hostId = cacheHostId;
    }
    await next();
  };
}
