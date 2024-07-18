import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomLoggerService } from 'src/utils/custom-logger/custom-logger.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { In, Repository } from 'typeorm';
import { RecordIdGeneratorService } from 'src/utils/record-id-generator/record-id-generator.service';
import { OrderItemsService } from './order-items/order-items.service';
import { UsersService } from 'src/users/users.service';
import OrderItems from './order-items/entities/order-items.entities';

@Injectable()
export class OrdersService {
  constructor(
    private readonly loggerService: CustomLoggerService,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly recordIdService: RecordIdGeneratorService,
    private readonly orderItemService: OrderItemsService,
    private readonly userService: UsersService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      /**@logger */
      this.loggerService.log('Creating order...');
      const orderObj = this.orderRepository.create(createOrderDto);
      orderObj.orderId = this.recordIdService.generate('ORDER_DETAIL');
      /**@todo: implement creation of order items */
      const items = await this.orderItemService.createOrderItems(
        createOrderDto['orderItems'],
      );
      orderObj.items = items;

      //Attach the user to the order if exists
      if (createOrderDto['userId']) {
        const user = await this.userService.findUserById(
          createOrderDto['userId'],
        );
        orderObj.user = user;
      }

      return await this.orderRepository.save(orderObj);
    } catch (createErr) {
      /**@logger */
      this.loggerService.error(createErr.message);
      if (createErr instanceof BadRequestException) throw createErr;
      throw new InternalServerErrorException('Error while creating order');
    }
  }

  async findAllOrders() {
    try {
      /**@logger */
      this.loggerService.log('Fetching order items...');
      const orderItems = await this.orderRepository.find();
      return orderItems;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      throw new InternalServerErrorException('Error while fetching orders');
    }
  }

  async findOneOrder(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Fetching order item');
      const orderItem = await this.orderRepository.findOne({
        where: {
          orderId: id,
        },
        relations: ['items'],
      });
      if (!orderItem) throw new BadRequestException('Order does not exist');
      return orderItem;
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if (fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while fetching order');
    }
  }

  async findOrdersByStatus(...status:string[]){
    try {
      /**@logger */
      this.loggerService.log('fetching orders...')
      const foundOrders = await this.orderRepository.find(
       {
        where: {
          status: In(status)
        }
       }
      )
      if (foundOrders) throw new BadRequestException('Orders not found')
    } catch (fetchErr) {
      /**@logger */
      this.loggerService.error(fetchErr.message);
      if(fetchErr instanceof BadRequestException) throw fetchErr;
      throw new InternalServerErrorException('Error while fetching orders')
    }
  }

  async updateOrder(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      /**@logger */
      this.loggerService.log('Creating order item');

      let order = await this.findOneOrder(id);

      this.loggerService.log(order.items);
      //updating order items...
      if (updateOrderDto['orderItems']) {
        const updateItemArr: OrderItems[] = [];
        for (const item of updateOrderDto['orderItems']) {
          const updatedItem = await this.orderItemService.updateOrderItem(item);
          updateItemArr.push(updatedItem);
        }
        order.items = [...order.items, ...updateItemArr];

        delete updateOrderDto['orderItems'];
      }

      //updating user
      if (updateOrderDto['userId']) {
        const updatedUser = await this.userService.findUserById(
          updateOrderDto['userId'],
        );
        order.user = updatedUser;

        delete updateOrderDto['userId'];
      }

      order = {
        ...order,
        total: updateOrderDto['total'] ?? order.total,
        status: updateOrderDto['status'] ?? order.status,
      };

      /**@todo:implement shipping and payment update info... */

      return await this.orderRepository.save(order);
    } catch (updateErr) {
      /**@logger */
      this.loggerService.error(updateErr.message);

      if (updateErr instanceof BadRequestException) throw updateErr;

      throw new InternalServerErrorException('Error while updating order item');
    }
  }

  async removeOrder(id: string) {
    try {
      /**@logger */
      this.loggerService.log('Deleting order...');
      const deletedOrder = await this.orderRepository.softDelete(id);
      if(!deletedOrder) throw new BadRequestException("Order could not be found");
      return deletedOrder;
    } catch (deleteErr) {
      /**@logger */
      this.loggerService.error(deleteErr.message);
      throw new InternalServerErrorException('Error while deleting order');
    }
  }

  //utility functions
  async completeOrder(orderId:string){
    try {
      /**@logger */
      this.loggerService.error('Completing order')
      const updatedOrder = await this.orderRepository.findOne({
        where:{
          orderId
        }
      })
      if(updatedOrder) throw new BadRequestException('Order does not exist');
      updatedOrder.status = OrderStatus.completed;
      await this.orderRepository.save(updatedOrder); 
    } catch (updateErr) {
      /**@logger */
      this.loggerService.error(updateErr.message);
      throw new InternalServerErrorException("Error occured while updating order")
    }
  }
}
