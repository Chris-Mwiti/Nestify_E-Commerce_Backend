import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { RecordIdGeneratorModule } from './record-id-generator/record-id-generator.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerModule } from './custom-logger/custom-logger.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot
    ({
      type: "mysql",
      host:"localhost",
      port: 3306,
      username: "root",
      password:"",
      database: "ecommerce_db",
      entities: [User],
      synchronize:true,
      logging: true,
      logger: "simple-console",

    }), RecordIdGeneratorModule, AuthModule, CustomLoggerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
}
