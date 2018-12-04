import config from './config';
import { logger } from './util/logger';
import * as redis from 'redis';

const client = redis.createClient(config.redis.REDIS_URL);

client.once('ready', () => logger.info('redis connection ready'));

const closeConnection = (): Promise<void> =>
  new Promise((resolve, reject) =>
    client.quit((err) => (err ? reject(err) : resolve()))
  );

export { client, closeConnection };
