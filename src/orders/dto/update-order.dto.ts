import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { UpdateOrderItemDto } from '../order-items/dto/update-order-item.dto';

export class UpdateOrderDto extends PartialType(OmitType(CreateOrderDto, ["orderItems"])) {
    orderItems?:UpdateOrderItemDto[]
}
