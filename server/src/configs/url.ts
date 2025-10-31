import { env } from './env';

const hashSymbol = '#';

export const CLIENT_URL = `${env.CORS_ORIGIN}/${hashSymbol}`;
export const withClient = (endPoint: string) => `${CLIENT_URL}${endPoint}`;
