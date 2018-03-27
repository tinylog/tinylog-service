import { User } from '../entities/User';

export class IUserLogin implements Partial<User> {
  email: string;
  password: string;
}

export class IUserRegister implements Partial<User> {
  email: string;
  password: string;
}

export class ILoginOrRegisterRes {
  id: number;
  email: string;
  xsrfToken: string;
  token?: string;
}

export class IContextState {
  id: number;
  email: string;
  xsrfToken: string;
}
