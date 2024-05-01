import { Module } from '@nestjs/common';
import { RecordIdGeneratorService } from './record-id-generator.service';

@Module({
  providers: [RecordIdGeneratorService],
  exports: [RecordIdGeneratorService]
})
export class RecordIdGeneratorModule {}
