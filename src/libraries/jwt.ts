import * as jwt from 'jsonwebtoken';
import * as config from 'config';

/**
 *
 * @param id 用户 ID
 * @param email 用户 Email
 * @param xsrfProtect 是否开启 XSRF 检测
 */
export const sign = (id: number, email: string, xsrfToken?: string) => {
  return jwt.sign(
    {
      id,
      email,
      xsrfToken
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.exp
    }
  );
};
