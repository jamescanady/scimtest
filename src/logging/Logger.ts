import type { ILogger } from '../_types';

const {
  APPLICATION_NAME = 'ce-platform-scim-api',
  LOGGING_LEVEL = 'info',
  ENVIRONMENT = 'dev',
  APP_VERSION = '0.0.0',
  HOSTNAME = 'localhost',
} = process.env;

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: unknown) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};


// https://docs.aws.amazon.com/lambda/latest/dg/nodejs-logging.html
export class Logger implements ILogger
{
  private logLevels = Object.keys(LogLevel);
  constructor() {
  }
  private isLoggingEnabled = (level: LogLevel): boolean => {
    const configured_logLevel = this.logLevels.findIndex(item => item.toUpperCase() === LOGGING_LEVEL.toUpperCase());
    const requested_logLevel = this.logLevels.findIndex(item => item.toUpperCase() === LogLevel[level].toUpperCase());
    return (requested_logLevel >= configured_logLevel);
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private log = (level: LogLevel, message: string, args: Record<string, any> = null) => {
    if (!this.isLoggingEnabled(level)) return;
    const logData = {
      level: LogLevel[level].toUpperCase(),
      env: ENVIRONMENT,
      portfolio: 'ce',
      application: APPLICATION_NAME,
      appVersion: APP_VERSION,
      service: 'api',
      source: APPLICATION_NAME,
      serviceHost: HOSTNAME,
      hostname: HOSTNAME,
      message,
      timestamp: new Date().toISOString(),
    };
    if (args) {
      if (args instanceof Error) {
        logData["error"] = {
          name: args.name,
          message: args.message,
          stack: args.stack,
        };
      } else {
        logData["data"] = args;
      }
    }
    const logMessage = JSON.stringify(logData, getCircularReplacer());
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage);
        break;
      case LogLevel.WARN:
        console.warn(logMessage);
        break;
      case LogLevel.ERROR:
        console.error(logMessage);
        break;
      default:
        console.info(logMessage);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public debug = (message: string, args: Record<string, any>) => this.log(LogLevel.DEBUG, message, args);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public info = (message: string, args: Record<string, any>) => this.log(LogLevel.INFO, message, args);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public warn = (message: string, args: Record<string, any>) => this.log(LogLevel.WARN, message, args);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public error = (message: string, args: Record<string, any>) => this.log(LogLevel.ERROR, message, args);
}
