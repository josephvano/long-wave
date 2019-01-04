import * as winston from "winston";
import {injectable} from "inversify";

const path = process.env.LONGWAVE_LOG_PATH || './logs';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: `${path}/error.log`, level: 'error' }),
    new winston.transports.File({ filename: `${path}/combined.log` })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    level: 'debug',
    format: winston.format.simple()
  }));
}

@injectable()
export class Logger {
  debug(message: string, ...meta: any[]): void {
    logger.debug(message, meta);
  }

  info(message: string, ...meta: any[]): void {
    logger.info(message, meta);
  }

  warn(message: string, ...meta: any[]): void {
    logger.warn(message, meta);
  }

  error(message: string, ...meta: any[]): void {
    logger.error(message, meta);
  }
}

