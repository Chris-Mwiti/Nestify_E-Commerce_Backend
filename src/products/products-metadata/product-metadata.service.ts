import { BadRequestException, Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductMetadata } from './entities/product-metadata.entity';
import { Repository } from 'typeorm';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { CreateProductMetaData } from './dto/create-product-metadata.dto';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { UpdateProductMetaData } from './dto/update-product-metadata.dto';
import { ProductsService } from '../products.service';

@Injectable()
export class ProductMetadataService {
  constructor(
    @InjectRepository(ProductMetadata)
    private readonly metadataRepo: Repository<ProductMetadata>,
    private readonly loggerService: CustomLoggerService,
    private readonly recorIdService:RecordIdGeneratorService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService:ProductsService
  ) {}

  async createMetadata(metadata:CreateProductMetaData | ProductMetadata){
    try {
        /**@logger */
        this.loggerService.log("Creating product metadata...");
        const metadataObj = this.metadataRepo.create(metadata);
        metadataObj.metadataId = this.recorIdService.generate("ASSET");

        return await this.metadataRepo.save(metadataObj);
    } catch (createErr) {
        /**@logger */
        this.loggerService.error(createErr.message);
        throw new InternalServerErrorException("Error while creating product metadata");
    }
  }

  async getAllMetadata(){
    try {
        /**@logger */
        this.loggerService.log("Fetching metadata...");
        const metadatas = this.metadataRepo.find();
        return metadatas
    } catch (fetchErr) {
        /**@logger */
        this.loggerService.error(fetchErr.message);
        throw new InternalServerErrorException("Error while fetching metadata...")
    }
  }

  async getProductMetadata(productId:string){
    try {
        /**@logger */
        this.loggerService.log("Fetching product metadata...");
        const productMetadata =  await this.metadataRepo.findOneBy({
            product: {
                productId
            }
        })

        if(!productMetadata) throw new BadRequestException("Product does not exist")

        return productMetadata
    } catch (fetchErr) {
        /**@logger */
        if(fetchErr instanceof BadRequestException) throw fetchErr
        throw new InternalServerErrorException("Error while fetching product metadata")
    }
  }

  async updateProductMetadata(updateDto:UpdateProductMetaData){
    try {
        /**@logger */
        this.loggerService.log("Updating product metadata...");
        let productToBeUpdated = await this.productService.findOneProduct(updateDto["productId"]);
        if(!productToBeUpdated) throw new BadRequestException("Product does not exist");

        delete updateDto.productId

        const updatedObj = this.metadataRepo.create(updateDto);
        for(const key in updatedObj){
            if(!updateDto[key]){
                updateDto[key] = productToBeUpdated[key]
            }
        }

        //Checks if metadata exists
        if(!productToBeUpdated.metadata){
            productToBeUpdated.metadata = await this.createMetadata(updatedObj);
            return await this.productService.saveProduct(productToBeUpdated);
        }

        productToBeUpdated.metadata = {
            ...productToBeUpdated.metadata,
            ...updatedObj
        }

        return await this.productService.saveProduct(productToBeUpdated)
    } catch (updateErr) {
        /**@logger */
        this.loggerService.error(updateErr.message);
        if(updateErr instanceof BadRequestException) throw updateErr
        throw new InternalServerErrorException("Error while updating metadata...");
    }
  }

  async deleteProductMetadata(metadataId:string){
    try {
        /**@logger */
        this.loggerService.log("Deleting product metadata...")
        return await this.metadataRepo.delete({
            metadataId
        })
    } catch (deleteErr) {
        /**@logger */
        this.loggerService.error(deleteErr.message);
        throw new InternalServerErrorException("Error while deleting ")
    }
  }
}
