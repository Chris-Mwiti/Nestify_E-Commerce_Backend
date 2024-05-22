import { Module, forwardRef } from '@nestjs/common';
import { ProductMetadataService } from './product-metadata.service';
import { ProductsModule } from '../products.module';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMetadata } from './entities/product-metadata.entity';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';

@Module({
  imports: [
    forwardRef(() => ProductsModule),
    CustomLoggerModule,
    TypeOrmModule.forFeature([ProductMetadata]),
    RecordIdGeneratorModule
  ],
  providers: [ProductMetadataService],
  exports: [ProductMetadataService],
})
export class ProductsMetadataModule {}
