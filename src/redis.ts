import config from './config';
import { logger } from './util/logger';
import * as redis from 'redis';

const client = redis.createClient(config.redis.REDIS_URL);

client.on('error', (err) => logger.debug('redis error', err));
client.on('ready', () => logger.info('redis connection ready'));

export { client };
