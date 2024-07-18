import { Module } from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { CollectionsController } from './collections.controller';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { CategoryModule } from 'src/category/category.module';
import { ProductsModule } from 'src/products/products.module';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';

@Module({
  imports: [
    CategoryModule,
    ProductsModule,
    CustomLoggerModule,
    RecordIdGeneratorModule,
    TypeOrmModule.forFeature([Collection]),
  ],
  controllers: [CollectionsController],
  providers: [CollectionsService],
})
export class CollectionsModule {}
