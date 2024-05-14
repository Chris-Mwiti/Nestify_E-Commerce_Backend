import { Module, ValidationPipe, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { RecordIdGeneratorModule } from 'src/record-id-generator/record-id-generator.module';
import { CustomLoggerModule } from 'src/custom-logger/custom-logger.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RecordIdGeneratorModule,
    CustomLoggerModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
