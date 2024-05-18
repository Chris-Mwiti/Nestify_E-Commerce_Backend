import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { CategoryService } from 'src/category/category.service';
import { Inventory } from 'src/inventory/entities/inventory.entity';
import { Category } from 'src/category/entities/category.entity';
import { InventoryService } from 'src/inventory/inventory.service';
import { plainToInstance } from 'class-transformer';
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Product)
    private readonly productRepsitory: Repository<Product>,
    private readonly recordId: RecordIdGeneratorService,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService:InventoryService
  ) {}
  async createProduct(createProductDto: CreateProductDto) {
    try {
      /**@logger */
      this.loggerService.log('Creating product...');
      const productObj = this.productRepsitory.create(createProductDto);
      productObj.productId = this.recordId.generate('PRODUCT');

      //Fetch the category if it exists
      const categoryInfo = await this.categoryService.findOneCategory(
        createProductDto['categoryId'],
      );
      productObj.category = categoryInfo;

      //create the inventory
      const inventoryInstance = plainToInstance(CreateInventoryDto, {
        quantity: createProductDto["quantity"],
        productId: productObj["productId"]
      })
      const inventory = await this.inventoryService.createInventory(inventoryInstance);
      productObj.inventory = inventory

      return await this.productRepsitory.save(productObj);
    } catch (createErr) {
      /**@logger */
      this.loggerService.error(createErr.message);
      throw new InternalServerErrorException('Error while creating product');
    }
  }

  async findAllProducts() {
    try {
      /**@logger */
      this.loggerService.log('Fetching products...');
      const products = await this.productRepsitory.find({
        relations: {
          category: true,
        },
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
          productId: id,
        },
        relations: {
          category: true,
        },
      });
      return product;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching product');
    }
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    try {
      /**@logger */
      this.loggerService.log('Updating product...');
      let productToUpdated = await this.findOneProduct(id);

      //Updates the product category
      if (updateProductDto['categoryId']) {
        const category = await this.categoryService.findOneCategory(
          updateProductDto['categoryId'],
        );
        productToUpdated.category = category;
      }

      //Updates the product inventory
      if (updateProductDto['quantity']) {
        productToUpdated.inventory =
          await this.inventoryService.updateProductInventory(
            productToUpdated['productId'],
            updateProductDto['quantity'],
          );
      }

      const { categoryId, ...dto } = updateProductDto;
      const newUpdateObj = { ...productToUpdated, ...dto };
      return await this.productRepsitory.save(newUpdateObj);
    } catch (updateError) {
      /**@logger */
      this.loggerService.error(updateError.message);

      if (updateError instanceof BadRequestException) throw updateError;

      throw new InternalServerErrorException('Error while updating product');
    }
  }

  async removeProduct(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Deleting product...');
      const deletedProduct = await this.productRepsitory.delete({
        productId: id,
      });
      return deletedProduct;
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      throw new InternalServerErrorException('Error while deleting product');
    }
  }
}
