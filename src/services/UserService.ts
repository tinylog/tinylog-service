import { Service } from 'typedi';
import UserRepository from '../repositories/UserRepository';
import { getCustomRepository } from 'typeorm';
import { IUserRegister, IUserLogin } from '../interfaces/User';
import { sign } from '../libraries/jwt';
import { SHA256 } from 'crypto-js';
import { BadRequestError } from 'routing-controllers';

@Service()
export class UserService {
  userRepository: UserRepository = getCustomRepository(UserRepository);

  /**
   * 注册一个新用户
   * @param body 用户信息
   */
  async register(body: IUserRegister) {
    const flag = await this.userRepository.isEmailRegisted(body.email);
    if (flag) {
      throw new BadRequestError('邮箱已经被注册了');
    }

    const user = await this.userRepository.newUser(body);
    const xsrfToken = SHA256(user.id + Date.now().toString()).toString();
    const jwt = sign(user.id, user.email, xsrfToken);
    return {
      id: user.id,
      email: user.email,
      xsrfToken,
      jwt
    };
  }

  /**
   * 用户登录
   * @param body 用户信息
   */
  async login(body: IUserLogin) {
    const flag = await this.userRepository.isEmailRegisted(body.email);
    if (!flag) {
      throw new BadRequestError('邮箱不存在');
    }

    const user = await this.userRepository.getUser(body);
    const xsrfToken = SHA256(user.id + Date.now().toString()).toString();
    const jwt = sign(user.id, user.email, xsrfToken);
    return {
      id: user.id,
      email: user.email,
      xsrfToken,
      jwt
    };
  }
}
