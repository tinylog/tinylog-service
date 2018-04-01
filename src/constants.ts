/**
 * Redis Token Key
 */
export const TOKEN_KEY = (token: string) => `TOKEN:${token}`;

/**
 * Redis Event Key
 */
export const SESSION_DISCONNECT = 'SESSION_DISCONNECT';
export const SESSION_CONNECT = 'SESSION_CONNECT';
