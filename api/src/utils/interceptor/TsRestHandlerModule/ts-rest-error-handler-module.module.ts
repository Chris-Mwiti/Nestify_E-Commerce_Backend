import { Module } from '@nestjs/common';
import { TsRestErrorHandlerProvider } from './providers/tsRestErrorHandler.provider';

@Module({
  providers: [TsRestErrorHandlerProvider],
  exports: [TsRestErrorHandlerProvider],
})
export class TsRestErrorHandlerModule {}
