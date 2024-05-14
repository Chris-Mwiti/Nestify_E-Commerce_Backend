import {
  Inject,
  Injectable,
  InternalServerErrorException,
  LoggerService,
  OnModuleInit,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants/saltrounds.constants';
import { UsersService } from 'src/users/users.service';
import { CustomLoggerService } from 'src/custom-logger/custom-logger.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'jsonwebtoken';
import { SignInDto } from './dto/signIn.dto';
import { ConfigService } from '@nestjs/config';
import { TAuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private readonly jwtService: JwtService,
    private readonly loggerService: CustomLoggerService,
    private readonly configService: ConfigService,
  ) {}

  async signIn(signInDto: SignInDto) {
    this.loggerService.log('Signing process began...');
    const user = await this.userService.findUserByEmail(signInDto.email);
    if (!user) throw new UnauthorizedException('User does not exist');

    const isPasswordValid = await this.comparePassword(
      signInDto.password,
      user.password,
    );
    if (!isPasswordValid) throw new UnauthorizedException('Wrong password');

    const { password, ...result } = user;
    const payload: TAuthDto = {
      userId: user.userId,
      role: user.role,
    };

    const access_token = await this.createAccessToken(payload);
    const refresh_token = await this.createRefreshToken(payload);

    return {
      access_token,
      refresh_token,
    };
  }

  async hashPassword(password: string) {
    const hashedPwd = await bcrypt.hash(password, SALT_ROUNDS);
    return hashedPwd;
  }

  async comparePassword(password: string, encryptedPassword: string) {
    const isPasswordValid = await bcrypt.compare(password, encryptedPassword);
    return isPasswordValid;
  }

  async createAccessToken(authDto: TAuthDto) {
    const payload: JwtPayload = {
      sub: authDto['userId'],
      role: authDto['role'],
    };
    const accessToken = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_TOKEN_SECRET'),
    });

    return accessToken;
  }

  async createRefreshToken(authDto: TAuthDto) {
    const payload: JwtPayload = {
      sub: authDto['userId'],
      role: authDto['role'],
    };

    const refreshToken = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
    });

    return refreshToken;
  }
}
