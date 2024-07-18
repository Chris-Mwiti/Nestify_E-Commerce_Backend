import { HttpException, ValueProvider } from '@nestjs/common';
import { TsRestException } from '@ts-rest/nest';
import AppRouter from 'api-contract';
import PROVIDER_KEYS from '../../ts/providers.keys';

export const TsRestErrorHandlerProvider : ValueProvider = {
    provide: PROVIDER_KEYS.TSRESTERRORPROVIDER,
    useValue: tsRestErrorHandler  
}

export type TRestErrorHandler = (errorInstance: HttpException, route: keyof typeof AppRouter, method:string) => void

export function tsRestErrorHandler(
  errorInstance: HttpException,
  route: keyof typeof AppRouter,
  method: string,
) {
  throw new TsRestException(route[method], {
    status: errorInstance.getStatus(),
    body: {
      message: errorInstance.message,
    },
  });
}
