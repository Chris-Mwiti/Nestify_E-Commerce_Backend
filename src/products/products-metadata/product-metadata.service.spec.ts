import { Test, TestingModule } from '@nestjs/testing';
import { ProductMetadataService } from './product-metadata.service';

describe('ProductMetadataService', () => {
  let service: ProductMetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductMetadataService],
    }).compile();

    service = module.get<ProductMetadataService>(ProductMetadataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
