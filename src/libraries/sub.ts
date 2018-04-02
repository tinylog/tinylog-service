import * as config from 'config';
import * as IORedis from 'ioredis';
import { SESSION_DISCONNECT, SESSION_CONNECT } from '../constants';
import { getCustomRepository } from 'typeorm';
import { PageRepository } from '../repositories/PageRepository';
import { SessionRepository } from '../repositories/SessionRepository';
import * as moment from 'moment';

const cacheConfig = config.cache;

/**
 * TODO: 保存到这个东西的话要解决重启数据丢失的问题
 */
const timerMap = new Map();

export const sub = new IORedis(cacheConfig.port, cacheConfig.host, {
  password: cacheConfig.password,
  db: cacheConfig.db
});

sub.on('connect', () => {
  console.log('[REDIS] pub Connected');
});

sub.on('disconnect', () => {
  console.error('[REDIS] pub Disconnected');
});

sub.on('error', (e: Error) => {
  console.error('[REDIS] pub Disconnected');
});

sub.subscribe([SESSION_CONNECT, SESSION_DISCONNECT], (err: Error, count: number) => {
  console.log(`[REDIS] subscribe to event: ${SESSION_CONNECT}`);
  console.log(`[REDIS] subscribe to event: ${SESSION_DISCONNECT}`);
});

/**
 * TODO: subscribe 模式
 * 1 分钟后会话重新建立了怎么办（虽然不太可能）
 * 避免更新导致 timer 丢失
 */
sub.on('message', async (channel: string, message: string) => {
  // Receive message Hello world! from channel news
  // Receive message Hello again! from channel music
  // console.log('Receive message %s from channel %s', message, channel);
  switch (channel) {
    // 失联
    case SESSION_DISCONNECT:
      const { pageId, sessionId } = JSON.parse(message);
      // 会话失联，启动 60 秒（1分钟）退出操作处理
      const timer = setTimeout(async () => {
        console.log(`[APP] session ${sessionId} end at page ${pageId}`);
        await Promise.all([
          getCustomRepository(PageRepository).exitPage(
            pageId,
            moment()
              .subtract(1, 'm')
              .toISOString()
          ),
          getCustomRepository(SessionRepository).endSession(
            sessionId,
            moment()
              .subtract(1, 'm')
              .toISOString()
          )
        ]);
      }, 60000);
      timerMap.set(`SESSION:${sessionId}`, timer);
      break;
    // 重新连接，清除计时器
    case SESSION_CONNECT:
      const { sessionId: sid } = JSON.parse(message);
      if (timerMap.has(`SESSION:${sid}`)) {
        clearTimeout(timerMap.get(`SESSION:${sid}`));
      }
    default:
      return;
  }
});
