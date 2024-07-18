import { BadRequestException, HttpException, InternalServerErrorException } from "@nestjs/common";
import { TsRestException } from "@ts-rest/nest";
import AppRouter from "api-contract";

class TsExceptionHandlerHelper {
    static catchError(errorInstance: HttpException, route: keyof typeof AppRouter, method: string){
        throw new TsRestException(route[method], {
          status: errorInstance.getStatus(),
          body: {
            message: errorInstance.message,
          },
        });
    }
}

export default TsExceptionHandlerHelper