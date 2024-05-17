import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';

@Catch()
export class AllFilter<T = HttpException> extends BaseExceptionFilter {
  constructor(private readonly loggerService:CustomLoggerService){
    super()
  }

  catch(exception: T, host: ArgumentsHost) {
    if(exception instanceof HttpException){
      const errorMessage = exception.message;
      this.loggerService.error(errorMessage);
    }
    super.catch(exception,host);
  }
}
