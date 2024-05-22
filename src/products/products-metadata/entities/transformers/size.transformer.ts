import { ValueTransformer } from 'typeorm';
import { SizesMetaData } from '../../dto/sizes-metadata.dto';
import { Logger } from '@nestjs/common';

export default class SizeTransfomer implements ValueTransformer {
    private logger:Logger = new Logger(SizeTransfomer.name);
  to(value: SizesMetaData[]) {
    this.logger.log(value);
    let transformerObj = {};
    for (const sizeMetadata of value) {
      transformerObj[sizeMetadata.size] = sizeMetadata;
    }
    return transformerObj;
  }

  from(value: {}) {
    let transformArr = [];
    this.logger.log(value);
    for (const sizeMetadata in value) {
      transformArr.push(value[sizeMetadata]);
    }
    return transformArr;
  }
}
