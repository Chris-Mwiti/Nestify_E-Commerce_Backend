import { Module, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { RecordIdGeneratorModule } from 'src/record-id-generator/record-id-generator.module';

@Module({
  imports:[TypeOrmModule.forFeature([User]), RecordIdGeneratorModule],
  controllers: [UsersController],
  providers: [UsersService, 
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ],
})
export class UsersModule {}
