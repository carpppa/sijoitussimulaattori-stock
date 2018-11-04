import { createLogger, format, transports } from 'winston';

import config from '../config';

const logger = createLogger({
  level: config.app.LOGGER_LEVEL,
  format: format.combine(
    format.colorize({
      all: config.app.NODE_ENV !== 'production',
    }),
    format.simple()
  ),
  transports: [new transports.Console()],
});

export default logger;
