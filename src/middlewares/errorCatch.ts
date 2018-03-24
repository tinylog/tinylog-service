import { ValidationError } from 'class-validator';
import { Context } from 'koa';
import { BadRequestError, InternalServerError } from 'routing-controllers';

export default function errorCatch(): (ctx: Context, next: () => Promise<{}>) => Promise<void> {
  return async (ctx: Context, next: () => Promise<{}>) => {
    try {
      await next();
    } catch (e) {
      let message;
      if (Reflect.has(e, 'errors') && e.errors[0] instanceof ValidationError) {
        message = Object.values(e.errors[0].constraints).join(';');
        e.status = 400;
      } else if (e instanceof BadRequestError) {
        // console.log('『捕获 BadRequestError 』\n', e)
      } else if (e instanceof InternalServerError) {
        console.error('『捕获 InternalServerError 』\n', e);
      } else if (e.httpCode === 401 || e.status === 401) {
        message = e.message;
      } else {
        console.error('『程序异常 o(╥﹏╥)o』\n', e);
        e.message = '程序异常';
      }
      ctx.status = e.httpCode || e.status || 500;
      ctx.body = {
        message: message || e.message
      };
    }
  };
}
