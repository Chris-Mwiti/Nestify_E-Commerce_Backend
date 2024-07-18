import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, tap } from 'rxjs';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { format } from 'date-fns';

@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
  constructor(private readonly loggerService: CustomLoggerService) {}
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest<Request>();

    /**
     * @logger
     */
    this.loggerService.log(
      `TIME: ${format(new Date(), 'Pp')}\tOrigin: ${request.originalUrl}\tMethod: ${
        request.method
      }`,
    );

    return next.handle();
  }
}
