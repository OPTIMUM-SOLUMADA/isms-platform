import { env } from '@/configs/env';
import pino from 'pino';

const isDev = env.NODE_ENV === 'development';

export const logger = isDev
    ? pino(
          pino.transport({
              target: 'pino-pretty',
              options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss',
                  ignore: 'pid,hostname',
              },
          }),
      )
    : pino({
          level: 'info',
      });
