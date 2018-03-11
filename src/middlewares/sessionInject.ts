import { Context } from 'koa';
import Cache from '../libraries/Cache';
import { BadRequestError } from 'routing-controllers';

/**
 * 检查 token 是否可用，可用的话注入 visiterId 和 hostId 到 state 中
 * 注意： token 即包含了有效 visiterId 和 hostId 的信息
 */
export default function sessionInject() {
  return async (ctx: Context, next: () => Promise<{}>) => {
    const session = await Cache.Instance.get(`TOKEN:${ctx.headers.Authorization}`);

    if (!session) {
      throw new BadRequestError('Initialize Is Required');
    }

    // TODO: hostId compare with http host
    const [hostId, visiterId] = session.split(':');

    ctx.state.hostId = hostId;
    ctx.state.visiterId = visiterId;
  };
}
