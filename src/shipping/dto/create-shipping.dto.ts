import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ShippingStatus } from "../entities/shipping.entity";
import { StartsWith } from "src/utils/validators/starts-with.validator";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { Order } from "src/orders/entities/order.entity";

export default class CreateShippingDto {
  @IsString()
  @IsNotEmpty()
  county: string;

  @IsString()
  @IsNotEmpty()
  town: string;

  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  locationDesc: string;

  @IsEnum(ShippingStatus)
  status:ShippingStatus

  @StartsWith(ERecordPrefix.ORDER)
  orderId: Order
}