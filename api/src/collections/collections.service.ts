import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from './entities/collection.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { CategoryService } from 'src/category/category.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly loggerService:CustomLoggerService,
    @InjectRepository(Collection)
    private readonly collectionRepository:Repository<Collection>,
    private readonly categoryServices:CategoryService,
    private readonly productServices:ProductsService,
    private readonly recordIdService:RecordIdGeneratorService
  ){}

  async createCollection(createCollectionDto:CreateCollectionDto){
    try{
      /**@logger */
      this.loggerService.log("Creating collection");
      const collectionInstance = this.collectionRepository.create();
      collectionInstance.collectionId = this.recordIdService.generate('COLLECTION');
      if (createCollectionDto['products']){
        const products = await this.productServices.findManyIn(
          ...createCollectionDto['products'],
        );
        collectionInstance.products = products
      }
      const categories = await this.categoryServices.findCategoriesIn(...createCollectionDto["categoryIds"]);
      collectionInstance.categories = categories;
      collectionInstance.categoryName = createCollectionDto['categoryName'];
    }catch(createErr){
      /**@logger */
      this.loggerService.error(createErr.message);
      throw new InternalServerErrorException("Error while creating categories");
    }
  }

  async findAllCollections(){
    try {
      /**@logger */
      this.loggerService.log('fetching collections')
      const collections = await this.collectionRepository.find();
      if(!collections) throw new BadRequestException('Collections could not be found');
      return collections
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if (fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while fetching collections');
    }
  }

  async findOneCollection(collectionId:string){
    try {
      /**@logger */
      this.loggerService.log("fetching collection");
      const collection = await this.collectionRepository.find({
        where:{
          collectionId
        },
        relations:{
          products: true,
          categories: true
        }
      })
      if(!collection) throw new BadRequestException("Collection could not be found");
      return collection;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if(fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException("Error while fetching collection")
    }
  }
  async customFindCollection(options?:FindManyOptions<Collection>){
    try {
      /**@logger */
      this.loggerService.log('Fetching collections');
      const collections = await this.collectionRepository.find(options);
      if(!collections) throw new BadRequestException("Collections could not be found")
      return collections;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if(fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while fetching collections');
    }
  }

  async updateCollection(collectionId:string, updateDto:UpdateCollectionDto){
    try {
      /**@logger */
      this.loggerService.log('updating collection...');
      const collection = await this.collectionRepository.findOne({
        where:{
          collectionId
        }
      })
      if(!collection) throw new BadRequestException('Collection was not found');

      //Update colllection categories
      if(updateDto["categoryIds"]){
        const categories = await this.categoryServices.findCategoriesIn(...updateDto["categoryIds"]);
        collection.categories = [...collection.categories, ...categories];
      }
      
      //Update collection products
      if(updateDto["productIds"]){
        const products = await this.productServices.findManyIn(...updateDto["productIds"]);
        collection.products = [...collection.products, ...products]
      }

      if(updateDto["categoryName"]){
        collection.categoryName = updateDto["categoryName"]
      }

      return await this.collectionRepository.save(collection);
    } catch (updateErr) {
      /**@logger */
      this.loggerService.error(updateErr.message);
      if(updateErr instanceof BadRequestException) throw updateErr;
      throw new InternalServerErrorException('Error while updating collections');
    }
  }

  async removeCollection(collectionId:string){
    try {
      /**@logger */
      this.loggerService.log("Removing collection");
      const deletedCollection = await this.collectionRepository.softDelete(collectionId);
      if(!deletedCollection) throw new BadRequestException("Collection could not be found");
      return deletedCollection
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      if(deleteErr instanceof BadRequestException) throw deleteErr;
      throw new InternalServerErrorException('Error while performing collection deletion');
    }
  }
}   
