import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RecordIdGeneratorModule } from './record-id-generator/record-id-generator.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptors/requestogger.interceptor';
import { DevtoolsModule } from '@nestjs/devtools-integration';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    RecordIdGeneratorModule,
    CustomLoggerModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'ecommerce_db',
      entities: [User],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production'
    })
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    }
  ],
})
export class AppModule {}
