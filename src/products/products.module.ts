import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { CategoryModule } from 'src/category/category.module';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { InventoryModule } from 'src/inventory/inventory.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    CustomLoggerModule,
    RecordIdGeneratorModule,
    CategoryModule,
    forwardRef(() => InventoryModule)
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}
