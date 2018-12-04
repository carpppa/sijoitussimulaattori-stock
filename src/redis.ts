import config from './config';
import { logger } from './util/logger';
import * as redis from 'redis';

const client = redis.createClient(config.redis.REDIS_URL);

client.once('ready', () => logger.info('redis connection ready'));

export { client };
