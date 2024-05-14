import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {

  constructor(private readonly loggerService:CustomLoggerService){}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err, caught) => {
        if (err instanceof BadRequestException) {
          /**
           * @logger
           */
          this.loggerService.error(err.message);
          return throwError(() => new BadRequestException(err.message));
        } else if (err instanceof UnauthorizedException) {
          /**
           * @logger
           */
          this.loggerService.log(err.message);
          return throwError(() => new UnauthorizedException(err.message));
        } else if (err instanceof ForbiddenException) {
          /**
           * @logger
           */
          this.loggerService.error(err.message);
          return throwError(() => new ForbiddenException(err.message));
        } else {
          /**
           * @logger
           */
          this.loggerService.error(err.message);
          return throwError(() => new InternalServerErrorException(err.message));
        }
      }),
    );
  }
}
