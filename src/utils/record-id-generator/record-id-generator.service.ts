import { Injectable } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { TRecordIdsPrefixes } from 'src/utils/types/recordId.types';


@Injectable()
export class RecordIdGeneratorService {
    generate(prefix:TRecordIdsPrefixes, noOfBytes:number = 4) {
        const randomId = crypto.randomBytes(5).toString('hex');
        console.log(randomId);
        return `${prefix}_${randomId}`
    }
}