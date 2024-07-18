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
import { CategoryModule } from './category/category.module';
import { ProductsModule } from './products/products.module';
import { Category } from './category/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { AllFilter } from './utils/ExceptionFilters/all/all.filter';
import { InventoryModule } from './inventory/inventory.module';
import { Inventory } from './inventory/entities/inventory.entity';
import { ProductMetadata } from './products/products-metadata/entities/product-metadata.entity';
import { OrdersModule } from './orders/orders.module';
import { PaymentModule } from './payment/payment.module';
import { ShippingModule } from './shipping/shipping.module';
import { SalesModule } from './sales/sales.module';
import { RefundsModule } from './refunds/refunds.module';
import { AnalyticsModule } from './analytics/analytics.module';
import OrderItems from './orders/order-items/entities/order-items.entities';
import { Order } from './orders/entities/order.entity';
import { Payment } from './payment/entities/payment.entity';
import { Shipping } from './shipping/entities/shipping.entity';
import { CollectionsModule } from './collections/collections.module';
import { Collection } from './collections/entities/collection.entity';
import { TsRestErrorHandlerModule } from './utils/interceptor/TsRestHandlerModule/ts-rest-error-handler-module.module';

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
      entities: [
        User,
        Category,
        Product,
        Inventory,
        ProductMetadata,
        OrderItems,
        Order,
        Payment,
        Shipping,
        Collection,
      ],
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
    OrdersModule,
    PaymentModule,
    ShippingModule,
    SalesModule,
    RefundsModule,
    AnalyticsModule,
    CollectionsModule,
    TsRestErrorHandlerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor,
    },
  ],
})
export class AppModule {}
