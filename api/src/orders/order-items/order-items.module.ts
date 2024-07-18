import { Module } from '@nestjs/common';
import { OrderItemsService } from './order-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import OrderItems from './entities/order-items.entities';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  providers: [OrderItemsService],
  imports: [
    TypeOrmModule.forFeature([OrderItems]),
    RecordIdGeneratorModule,
    CustomLoggerModule,
    ProductsModule,
  ],
  exports: [OrderItemsService],
})
export class OrderItemsModule {}
