import { Module, forwardRef } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Inventory]),
    CustomLoggerModule,
    RecordIdGeneratorModule,
    forwardRef(() => ProductsModule)
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {}
