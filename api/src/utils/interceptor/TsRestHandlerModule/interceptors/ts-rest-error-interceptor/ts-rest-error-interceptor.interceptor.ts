import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import PROVIDER_KEYS from 'src/utils/interceptor/ts/providers.keys';
import { tsRestErrorHandler } from '../../providers/tsRestErrorHandler.provider';

@Injectable()
export class TsRestErrorInterceptorInterceptor implements NestInterceptor {
  constructor(@Inject(PROVIDER_KEYS.TSRESTERRORPROVIDER) private readonly tsRestErrorHandlerFunc: ReturnType<typeof tsRestErrorHandler> ){}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe();
  }
}
