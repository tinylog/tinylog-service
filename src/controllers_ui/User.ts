import { JsonController, Post, Body, Ctx } from 'routing-controllers';
import { Service, Inject } from 'typedi';
import { IUserLogin, IUserRegister, ILoginOrRegisterRes } from '../interfaces/User';
import { Description, ResType } from 'routing-controllers-openapi-v3';
import { UserService } from '../services/UserService';
import { Context } from 'koa';
// import * as config from 'config';

@Service()
@JsonController('/user')
export class UserController {
  @Inject() userService: UserService;

  @Post('/login')
  @ResType(ILoginOrRegisterRes)
  @Description('用户登录，服务端返回的 xsrf-token 需要前端设置到名为 xsrf-token 的头部中')
  async login(@Ctx() ctx: Context, @Body() body: IUserLogin): Promise<ILoginOrRegisterRes> {
    const data = await this.userService.login(body);
    // ctx.cookies.set('jwt', data.jwt, {
    //   httpOnly: true,
    //   maxAge: +config.jwt.exp * 1000,
    //   overwrite: true
    // });

    return {
      id: data.id,
      email: data.email,
      xsrfToken: data.xsrfToken,
      token: data.jwt
      // token: config.env === 'production' ? undefined : data.jwt // DEBUG MESSAGE
    };
  }

  @Post('/register')
  @ResType(ILoginOrRegisterRes)
  @Description('用户注册，同注册')
  async register(@Ctx() ctx: Context, @Body() body: IUserRegister): Promise<ILoginOrRegisterRes> {
    const data = await this.userService.register(body);
    // ctx.cookies.set('jwt', data.jwt, {
    //   httpOnly: true,
    //   maxAge: +config.jwt.exp * 1000,
    //   overwrite: true
    // });
    return {
      id: data.id,
      email: data.email,
      xsrfToken: data.xsrfToken,
      token: data.jwt
    };
  }
}
