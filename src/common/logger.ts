import * as winston from "winston";
import {injectable} from "inversify";
import { Logger as WinstonLogger } from "winston";

export interface ILogger{
  debug(message: string, ...meta: any[]):void;
  info(message: string, ...meta: any[]):void;
  warn(message: string, ...meta: any[]):void;
  error(message: string | any): void;
}

export class NullLogger implements ILogger {
  debug(message: string, ...meta: any[]): void {
  }

  info(message: string, ...meta: any[]): void {
  }

  warn(message: string, ...meta: any[]): void {
  }

  error(message: string): void {
  }
}

@injectable()
export class Logger implements ILogger {
  private _logger: WinstonLogger;

  constructor(namespace: string, path: string) {
    this._logger = winston.createLogger({
      level     : 'debug',
      format    : winston.format.json(),
      transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({filename: `${path}/${namespace}-error.log`, level: 'error'}),
        new winston.transports.File({filename: `${path}/${namespace}-combined.log`})
      ]
    });

    this._logger.exitOnError = false;

    this._logger.exceptions.handle(
      new winston.transports.File({ filename: `${path}/${namespace}-exceptions.log`})
    );

    //
    // If we're not in production then log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    //
    if (process.env.NODE_ENV !== 'production') {
      this._logger.add(new winston.transports.Console({
        level : 'debug',
        format: winston.format.simple()
      }));
    }

  };

  debug(message: string, ...meta: any[]): void {
    this._logger.debug(message, meta);
  }

  info(message: string, ...meta: any[]): void {
    this._logger.info(message, meta);
  }

  warn(message: string, ...meta: any[]): void {
    this._logger.warn(message, meta);
  }

  error(message: string | any, ...meta: any[]): void {
    this._logger.error(message, meta);
  }
}

