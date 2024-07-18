import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrderItemsModule } from './order-items/order-items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    OrderItemsModule,
    TypeOrmModule.forFeature([Order]),
    RecordIdGeneratorModule,
    CustomLoggerModule,
    OrderItemsModule,
    UsersModule
  ],
})
export class OrdersModule {}
