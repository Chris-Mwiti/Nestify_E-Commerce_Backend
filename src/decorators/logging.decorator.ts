import winston, { format, transports } from 'winston';
import path from 'path';
const { timestamp, combine, label, printf, colorize } = format;

const pathRedirector = (pathName: string) => {
  const newPath = path.resolve(__dirname, 'logs', pathName);
  return newPath;
};


const customLoggerFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp}\t[${label}]\t${level}\t${message}`;
});

function logger(loggerLabel: string) {
  return winston.createLogger({
    level: 'debug',
    format: combine(
      label({ label: loggerLabel }),
      timestamp(),
      colorize({ all: true}),
      customLoggerFormat,
    ),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: pathRedirector('errLogs.txt'),
        level: 'error',
      }),
      new transports.File({
        filename: pathRedirector('warnLogs.txt'),
        level: 'warn',
      }),
      new transports.File({
        filename: pathRedirector('infoLogs.txt'),
        level: 'info',
      }),
    ],
  });
}

function loggedMethod(
  label: string,
  message: string,
  mode?: 'error' | 'warn' | 'info',
): MethodDecorator {
  switch (mode) {
    case 'error':
      logger(label).error(message);
      break;
    case 'warn':
      logger(label).warn(message);
      break;
    case 'info':
      logger(label).info(message);
      break;
    default:
      logger(label).info(message);
  }
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    return descriptor
  };
}

export default loggedMethod;
