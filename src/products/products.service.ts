import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { CategoryService } from 'src/category/category.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Product)
    private readonly productRepsitory: Repository<Product>,
    private readonly recordId:RecordIdGeneratorService,
    private readonly categoryService:CategoryService
  ) {}
  async createProduct(createProductDto: CreateProductDto) {
    try {
      /**@logger */
      this.loggerService.log("Creating product...")
      const productObj = this.productRepsitory.create(createProductDto);
      productObj.productId = this.recordId.generate("PRODUCT");

      //Fetch the category if it exists
      const categoryInfo = await this.categoryService.findOneCategory(createProductDto["categoryId"]);
      productObj.category = categoryInfo;
      
      return await this.productRepsitory.save(productObj)
    } catch (createErr) {
      /**@logger */
      this.loggerService.error(createErr.message);
      throw new InternalServerErrorException("Error while creating product")
    }
  }

  async findAllProducts() {
    try {
      /**@logger */
      this.loggerService.log('Fetching products...');
      const products = await this.productRepsitory.find({
        relations: {
          category: true
        }
      });
      return products;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching products');
    }
  }

  async findOneProduct(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Fetching product...');
      const product = await this.productRepsitory.findOne({
        where: {
          productId: id
        },
        relations: {
          category: true
        }
      })
      return product
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException("Error while fetching product");
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      /**@logger */
      this.loggerService.log("Updating product...");

      const updateObj = this.productRepsitory.create(updateProductDto);
      updateObj.productId = id
      const updatedProduct = await this.productRepsitory.save(updateObj);

      return updatedProduct
    } catch (updateError) {
      /**@logger */
      this.loggerService.error(updateError.message);
      throw new InternalServerErrorException('Error while updating product');
    }
  }

  async removeProduct(id: string) {
  try {
      /**@logger */
      this.loggerService.log("Deleting product...");
      const deletedProduct = await this.productRepsitory.delete({
        productId: id
      })
      return deletedProduct
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      throw new InternalServerErrorException('Error while deleting product');
    }
  }
}
