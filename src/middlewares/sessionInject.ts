import { Context } from 'koa';
import { getCache } from '../libraries/cache';
import { BadRequestError } from 'routing-controllers';
import { TOKEN_KEY } from '../constants';

/**
 * 检查 token 是否可用，可用的话注入 sessionId 和 hostId 到 state 中
 * 注意： token 即包含了有效 sessionId 和 hostId 的信息
 */
export function sessionInject() {
  return async (ctx: Context, next: () => Promise<{}>) => {
    const session = await getCache().get(TOKEN_KEY(ctx.headers.authorization));

    if (!session) {
      throw new BadRequestError('非法请求');
    }

    const [sessionId, hostId] = session.split(':').map(i => +i);
    ctx.state.hostId = hostId;
    ctx.state.sessionId = sessionId;

    await next();
  };
}
