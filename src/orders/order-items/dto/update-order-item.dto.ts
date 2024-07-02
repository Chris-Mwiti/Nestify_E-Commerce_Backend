import { PartialType } from "@nestjs/mapped-types";
import CreateOrderItem from "./create-order-item.dto";

export class UpdateOrderItemDto extends PartialType(CreateOrderItem) {
    itemId:string
}