import { JsonController, Post, Body } from 'routing-controllers';
import { Service } from 'typedi';
import { IUserLogin, IUserRegister } from '../interfaces/User';
import { Description } from 'routing-controllers-openapi-v3';

@Service()
@JsonController('/user')
export class UserController {
  @Post('/login')
  @Description('登录，后续认证依赖 Cookie 里处理，前端不用做任何处理')
  async login(@Body() body: IUserLogin) {
    // todo
  }

  @Post('/register')
  @Description('注册，注册后即自动登录，后续认证依赖 Cookie 里处理，前端不用做任何处理')
  async register(@Body() body: IUserRegister) {
    // todo
  }
}
