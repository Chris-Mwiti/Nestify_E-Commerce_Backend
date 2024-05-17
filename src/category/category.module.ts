import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CustomLoggerModule } from 'src/utils/custom-logger/custom-logger.module';
import { RecordIdGeneratorModule } from 'src/utils/record-id-generator/record-id-generator.module';
import { TreesController } from './category/trees/trees.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    CustomLoggerModule,
    RecordIdGeneratorModule
  ],
  controllers: [TreesController, CategoryController],
  providers: [CategoryService],
  exports: [CategoryService]
})
export class CategoryModule {}
