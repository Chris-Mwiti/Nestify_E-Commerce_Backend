import { ArgumentMetadata, BadRequestException, Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common';

@Injectable()
export class TreeLevelPipe implements PipeTransform {
  transform(value:string , metadata: ArgumentMetadata) {
    if(metadata.type !== 'query') throw new InternalServerErrorException('Pipe should be used in a query');

    if(value === "ancestors" || value === "descendants"){
      return value
    }
    throw new BadRequestException('Tree query level should be either ancestors or descendants');
  }
}
