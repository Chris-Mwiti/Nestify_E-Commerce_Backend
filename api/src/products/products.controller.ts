import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  HttpException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enum/role.enum';
import { TsRestException, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import AppRouter from 'api-contract';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import PROVIDER_KEYS from 'src/utils/interceptor/ts/providers.keys';
import { TRestErrorHandler, tsRestErrorHandler } from 'src/utils/interceptor/TsRestHandlerModule/providers/tsRestErrorHandler.provider';

@Controller('products')
@Roles(Role.ADMIN)
export class ProductsController {
  constructor(
   private readonly productsService: ProductsService,
    @Inject(PROVIDER_KEYS.TSRESTERRORPROVIDER)
    private readonly tsRestHandlerFunc: TRestErrorHandler,
  ) {}
  @TsRestHandler(AppRouter.products)
  async productsHandler() {
    return tsRestHandler(AppRouter.products, {
      createProduct: async ({ body }) => {
        try {
          const createdProduct = await this.productsService.createProduct(body);
          if(createdProduct){
            return {
              status: 201,
              body: "ok"
            }
          }else throw new TsRestException(AppRouter.products.createProduct,{
            status: 500,
            body:{
              message: "Error while creating product" 
            }
          })
        } catch (createErr) {
          this.tsRestHandlerFunc(createErr, "products", "createProduct");
        }
      },
      getAllProducts({query}) {
        try {
            
        } catch (fetchErr) {
          
        }
      },
    });
  }
}
