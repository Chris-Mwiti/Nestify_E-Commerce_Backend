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
import { FindManyOptions, In, Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { CategoryService } from 'src/category/category.service';
import { InventoryService } from 'src/inventory/inventory.service';
import { plainToInstance } from 'class-transformer';
import { CreateInventoryDto } from 'src/inventory/dto/create-inventory.dto';
import { ProductMetadataService } from './products-metadata/product-metadata.service';
import { UpdateProductMetaData } from './products-metadata/dto/update-product-metadata.dto';
import { CreateProductMetaData } from './products-metadata/dto/create-product-metadata.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Product)
    private readonly productRepsitory: Repository<Product>,
    private readonly recordId: RecordIdGeneratorService,
    private readonly categoryService: CategoryService,
    @Inject(forwardRef(() => InventoryService))
    private readonly inventoryService:InventoryService,
    @Inject(forwardRef(() => ProductMetadataService))
    private readonly productMetadataService:ProductMetadataService
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


      //Metadata Creation
      if(createProductDto["sizes"] || createProductDto["color"] || createProductDto["imageUrl"]){
        const metadataObj:CreateProductMetaData= {
          sizes: createProductDto["sizes"],
          color: createProductDto["color"],
          imageUrl: createProductDto["imageUrl"]
        }
        const productMetadata = await this.productMetadataService.createMetadata(metadataObj);
        productObj.metadata = productMetadata
      }

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
          metadata: true,
          inventory: true
        },
      });
      return products;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching products');
    }
  }

  async findManyIn(...productIds:string[]){
    try {
      /**@logger */
      this.loggerService.log('Fetching products in many operation....');
      const foundProducts = await this.productRepsitory.find({
        where:{
          productId: In(productIds)
        }
      })
      if(!foundProducts){
        throw new BadRequestException("Products could not be found");
      }
      return foundProducts;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr);
      if (fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while trying to fetch products');
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

      //Updates the product metadata
      if(updateProductDto["sizes"] || updateProductDto["color"] || updateProductDto["imageUrl"]){
        const updateMetadataObj:UpdateProductMetaData = {
          productId: productToUpdated.productId,
          sizes: updateProductDto["sizes"],
          color: updateProductDto["color"],
          imageUrl: updateProductDto["imageUrl"]
        }
        await this.productMetadataService.updateProductMetadata(updateMetadataObj);

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
      const deletedProduct = await this.productRepsitory.softDelete(id);
      return deletedProduct;
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      throw new InternalServerErrorException('Error while deleting product');
    }
  }

  async saveProduct(product:Product){
    return this.productRepsitory.save(product);
  }


  async findWithRelations(options?:FindManyOptions<Product>){
    try {
      /**@logger */
      this.loggerService.log('fetching products with relation');
      const products = await this.productRepsitory.find(options);
      if(!products) throw new BadRequestException('Product|s does not exist');
      return products
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if(fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while fetching products')
    }
  }
}
