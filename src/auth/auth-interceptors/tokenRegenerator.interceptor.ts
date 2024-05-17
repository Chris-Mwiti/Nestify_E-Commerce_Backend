import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, map } from 'rxjs';
import { AuthService } from '../auth.service';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';

@Injectable()
export class TokenRegeneratorInterceptor implements NestInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: CustomLoggerService,
  ) {}
  async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest<Request>();
    const decodedAccessToken = request['decodedAccessToken'];
    const decodeRefreshToken = request['decodedRefreshToken'];

    if (decodedAccessToken) {
      /**
       * @logger warn
       */
      this.loggerService.warn('Regenerating refresh token...');
      const refreshToken =
        await this.authService.createAccessToken(decodedAccessToken);

      return next.handle().pipe(
        map((data) => ({
          refreshToken,
          data,
        })),
      );
    } else if (decodeRefreshToken) {
      /**
       * @logger warn
       */
      this.loggerService.warn('Regenerating access token...');
      const accessToken =
        await this.authService.createAccessToken(decodeRefreshToken);
      this.loggerService.warn(accessToken);

      return next.handle().pipe(
        map((data) => ({
          accessToken,
          data,
        })),
      );
    } else {
      /**
       * @logger warn
       */
      this.loggerService.warn('Next handle has been called...');
      return next.handle();
    }
  }
}
