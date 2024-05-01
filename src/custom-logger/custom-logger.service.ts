import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';

const { combine, timestamp, label, printf, colorize } = winston.format

@Injectable()
export class CustomLoggerService implements LoggerService {
    private logger:winston.Logger;
    constructor(){
        this.logger = winston.createLogger({
            level: "info",
            format: combine(
                label(),
                timestamp(),
                colorize({ all: true }),
                this.customLoggerFormat()
            ),
            transports: [
                new winston.transports.Console(),
                new winston.transports.File({
                    filename: this.pathRedirector("errLogs.txt"),
                    level: "error"
                }),
                new winston.transports.File({
                    filename: this.pathRedirector('warnLogs.txt'),
                    level: 'warn'
                }),
                new winston.transports.File({
                    filename: this.pathRedirector("infoLogs.txt"),
                    level: 'info'
                })
            ]
        })
    }


    private pathRedirector(pathName:string) {
        const newPath = path.resolve(__dirname, 'logs', pathName);
        return newPath;
    }

    private customLoggerFormat(){
        return printf(({ level, message, label, timestamp }) => {
          return `${timestamp}\t[${label}]\t${level}\t${message}`;
        });
    }

    log(message: any, ...optionalParams: any[]) {
        this.logger.info(message, ...optionalParams);
    }

    warn(message: any, ...optionalParams: any[]) {
        this.logger.warn(message, ...optionalParams);
    }

    debug(message: any, ...optionalParams: any[]) {
        this.logger.debug(message, ...optionalParams);
    }
    
    error(message: any, ...optionalParams: any[]) {
        this.logger.error(message, ...optionalParams);
    }
}
