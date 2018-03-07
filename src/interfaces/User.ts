import User from '../entities/User';

export class IUserLogin implements Partial<User> {
  email: string;
  password: string;
}

export class IUserRegister implements Partial<User> {
  email: string;
  password: string;
}
