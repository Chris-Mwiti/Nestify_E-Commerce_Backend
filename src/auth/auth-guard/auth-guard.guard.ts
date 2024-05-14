import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { TAuthDto } from '../dto/auth.dto';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly loggerService: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    /**
     * @logger
     */
    this.loggerService.log('Auth guard in action..', { label: AuthGuard.name });

    const request = context.switchToHttp().getRequest<Request>();

    const [accessToken, refreshToken] = this.extractTokenFromHeader(request);

    /**
     * @todo update the authentification system
     */
    if (accessToken && refreshToken) {
      const canActivate = await this.authAccessAndRefreshToken(
        accessToken,
        refreshToken,
        request,
      );
      if (!canActivate) return Promise.resolve(false);
      return Promise.resolve(true);

    } else if (!accessToken && refreshToken) {
      this.loggerService.log('Access token revalidation');
      const canActivate = await this.authRefreshToken(refreshToken, request);
      if (!canActivate) return Promise.resolve(false);

    } else if (accessToken && !refreshToken) {
      const canActivate = await this.authAccessToken(accessToken, request);
      if (!canActivate) return Promise.resolve(false);

    } else {
      return Promise.resolve(false);
    }
  }

  private async authAccessToken(accessToken: string, request: Request) {
    try {
      const isAccessTokenValid = await this.validateAccessToken(accessToken);

      if (isAccessTokenValid) {
        const decodedAccessToken =
          this.jwtService.decode<TAuthDto>(accessToken);
        request['decodedAccessToken'] = decodedAccessToken;
        return Promise.resolve(true);
      }
    } catch (tokenError) {
      /**
       * @logger
       */
      this.loggerService.error(tokenError.message);
      throw new UnauthorizedException('Your session has expired...Log in back');
    }
  }

  private async authRefreshToken(refreshToken: string, request: Request) {
    try {
      const isRefreshTokenValid = await this.validateRefreshToken(refreshToken);

      if (isRefreshTokenValid) {
        const decodedRefreshToken =
          this.jwtService.decode<TAuthDto>(refreshToken);
        request['decodedRefreshToken'] = decodedRefreshToken;

        return Promise.resolve(true);
      }
    } catch (tokenErr) {
      /**
       * @logger
       */
      this.loggerService.error(tokenErr.message);
      throw new UnauthorizedException('Your session has expired...Log in back');
    }
  }

  private async authAccessAndRefreshToken(
    accessToken: string,
    refreshToken: string,
    request: Request,
  ) {
    try {
      const isAccessTokenValid = await this.validateAccessToken(accessToken);
      const isRefreshTokenValid = await this.validateRefreshToken(refreshToken);

      if (isAccessTokenValid && isRefreshTokenValid) {
        const authDecodedDto = this.jwtService.decode<TAuthDto>(accessToken);
        //Attach the user object to the request object
        request['user'] = authDecodedDto;
        return Promise.resolve(true);
      }
    } catch (tokenError) {
      /**
       * @logger
       */
      this.loggerService.error(tokenError.message);
      throw new UnauthorizedException('Your session has expired...Log in back');
    }
  }

  private async validateAccessToken(token: string) {
    const isAccessTokenValid = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
    });
    return isAccessTokenValid;
  }

  private async validateRefreshToken(token: string) {
    const isRefreshTokenValid = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });
    return isRefreshTokenValid;
  }

  private extractTokenFromHeader(request: Request) {
    const [type, accessToken, refreshToken] =
      request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? [accessToken, refreshToken] : [];
  }
}
