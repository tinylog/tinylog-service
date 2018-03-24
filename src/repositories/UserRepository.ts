import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
  /**
   * 检查邮箱是否已经被注册
   * @param email 邮箱
   */
  async isEmailRegisted(email: string) {
    const user = await this.findOne({ email });
    return !!user;
  }

  async newUser(body: Partial<User>) {
    return await this.save(this.create(body));
  }

  async getUser(body: Partial<User>) {
    return await this.findOne(body);
  }
}
