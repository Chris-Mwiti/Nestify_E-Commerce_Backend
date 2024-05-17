import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { RecordIdGeneratorModule } from './utils/record-id-generator/record-id-generator.module';
import { AuthModule } from './auth/auth.module';
import { CustomLoggerModule } from './utils/custom-logger/custom-logger.module';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLoggerInterceptor } from './interceptors/requestogger.interceptor';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { ErrorInterceptor } from './interceptors/error/error.interceptor';
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { Category } from './category/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { AllFilter } from './utils/ExceptionFilters/all/all.filter';
import { InventoryModule } from './inventory/inventory.module';

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
      entities: [User,Category,Product],
      synchronize: true,
      logging: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    CategoryModule,
    ProductsModule,
    InventoryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllFilter
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {}
