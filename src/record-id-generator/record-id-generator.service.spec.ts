import { Test, TestingModule } from '@nestjs/testing';
import { RecordIdGeneratorService } from './record-id-generator.service';

describe('RecordIdGeneratorService', () => {
  let service: RecordIdGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecordIdGeneratorService],
    }).compile();

    service = module.get<RecordIdGeneratorService>(RecordIdGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
