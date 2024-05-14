import { Body, Controller, HttpCode, HttpStatus, InternalServerErrorException, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { SignInDto } from './dto/signIn.dto';
import { TokenRegeneratorInterceptor } from './auth-interceptors/tokenRegenerator.interceptor';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly loggerService: CustomLoggerService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: SignInDto) {
    try {
        const tokens = await this.authService.signIn(signInDto);
        return tokens
    } catch (createErr) {
      this.loggerService.error(createErr.message);
      throw createErr;
    }
  }
}
