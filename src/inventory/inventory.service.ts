import { BadRequestException, Inject, Injectable, InternalServerErrorException, forwardRef } from '@nestjs/common';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class InventoryService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Inventory)
    private readonly inventoryRepository: Repository<Inventory>,
    private readonly recordId:RecordIdGeneratorService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productService:ProductsService
  ) {}
  async createInventory(createInventoryDto: CreateInventoryDto) {
    try {
      /**@logger */
      this.loggerService.log('Creating inventory...')
      const inventoryObj = this.inventoryRepository.create(createInventoryDto);
      inventoryObj.inventoryId = this.recordId.generate("INVENTORY");

      //Fetch the product associated with the product
      const inventoryProduct = await this.productService.findOneProduct(createInventoryDto["productId"]);
      inventoryObj.product = inventoryProduct

      return await this.inventoryRepository.save(inventoryObj);
    } catch (createErr) {
      /**@logger */
      this.loggerService.error(createErr.message);

      if(createErr instanceof BadRequestException) throw createErr

      throw new InternalServerErrorException('Error while creating inventory');
    }
  }

  async findAllInventory() {
    try {
      /**@logger */
      this.loggerService.log('Fetching inventory details...');
      const inventories = await this.inventoryRepository.find({
        relations:['product']
      });
      return inventories
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching inventories');
    }
  }

  async findOneInventory(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Fetching inventory...')
      const inventory = await this.inventoryRepository.findOne({
        where:{
          inventoryId: id
        },
        relations: ['product']
      })

      if(!inventory) throw new BadRequestException('Inventory not found')
      return inventory
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);

      if(fetchErr instanceof BadRequestException) throw fetchErr

      throw new InternalServerErrorException('Error while fetching inventory')
    }
  }

 async updateInventory(id: string, updateInventoryDto: UpdateInventoryDto) {
    try {
      /**@logger */
      this.loggerService.log('Updating inventory...');
      const inventoryToBeUpdated = await this.findOneInventory(id);
      if(updateInventoryDto["productId"]){
        const productUpdate = await this.productService.findOneProduct(updateInventoryDto["productId"]);
        inventoryToBeUpdated.product = productUpdate;
      }
      inventoryToBeUpdated.quantity = updateInventoryDto["quantity"];
      inventoryToBeUpdated.lastRefilDate = new Date();
      return await this.inventoryRepository.save(inventoryToBeUpdated);
    } catch (updateErr) {
      /**@logger */
      if(updateErr instanceof BadRequestException) throw updateErr
      throw new InternalServerErrorException('Error while updating inventory');
    }
  }

  async updateProductInventory(productId:string, quantity:number){
    try {
      /**@logger */
      this.loggerService.log("Updating product inventory...");
      const productInventory = await this.inventoryRepository.findOneBy({
        product: {
          productId: productId
        }
      })

      if(!productInventory) throw new BadRequestException('Product does not exist')

      productInventory.quantity = quantity;
      productInventory.lastRefilDate = new Date();
      return await this.inventoryRepository.save(productInventory);
    } catch (error) {
      
    }
  }

  removeInventory(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Deleting inventory....');
      return this.inventoryRepository.delete({
        inventoryId: id
      })
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      throw new InternalServerErrorException('Error while deleting inventory')
    }
  }
}
