import { Module, ValidationPipe, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TokenRegeneratorInterceptor } from './auth-interceptors/tokenRegenerator.interceptor';

@Module({
  imports: [
    CustomLoggerModule,
    JwtModule.register({
      signOptions: {
        expiresIn: '3600s',
      },
      global: true,
      secret: process.env.JWT_TOKEN,
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TokenRegeneratorInterceptor,
    },
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
