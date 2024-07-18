import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import OrderItems from './entities/order-items.entities';
import { Repository } from 'typeorm';
import CreateOrderItem from './dto/create-order-item.dto';
import { ProductsService } from 'src/products/products.service';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    private readonly recordIdService: RecordIdGeneratorService,
    @InjectRepository(OrderItems) private readonly itemsRepository:Repository<OrderItems>,
    private readonly productService:ProductsService
  ) {}

  async createOrderItems(createOrderItemsDto:CreateOrderItem[]){
    try {
        /**@logger */
        this.loggerService.log("Creating order items");
        const itemObjArr:OrderItems[] = []
        for(const item of createOrderItemsDto){
            const itemObj = this.itemsRepository.create(item);
            
            //Attach the product to the order item
            const product = await this.productService.findOneProduct(item["productId"]);
            itemObj.product = product

            itemObj.itemId = this.recordIdService.generate("ORDER_ITEM");
            await this.itemsRepository.save(itemObj);
            itemObjArr.push(itemObj);
        }
        if(itemObjArr.length <= 0) throw new BadRequestException("For creation of order, order  items must exist");
        return itemObjArr
    } catch (createErr) {
        /**@logger */
        this.loggerService.error(createErr.message);
        if(createErr instanceof BadRequestException) throw createErr
        throw new InternalServerErrorException("Error while creating order items");
    }
  }

  async updateOrderItem(updateItemDto:UpdateOrderItemDto){
    try {
        /**@logger */
        this.loggerService.log("Updating order item");
        let orderItem = await this.itemsRepository.findOneBy({
            itemId:updateItemDto["itemId"]
        })
        this.loggerService.warn(orderItem);
        if(!orderItem) throw new BadRequestException("Order item does not exist");

        if(updateItemDto["productId"]){
            const product = await this.productService.findOneProduct(updateItemDto["productId"]);
            orderItem.product = product;
            delete updateItemDto["productId"];
        }

        const updatedOrderItem = {

            ...orderItem,
            ...updateItemDto
        }

        return await this.itemsRepository.save(updatedOrderItem);
    } catch (updateErr) {
        /**@logger */
        this.loggerService.error(updateErr.message);

        if(updateErr instanceof BadRequestException) throw updateErr

        throw new InternalServerErrorException("Error while updating order item");
    }
  }
}
