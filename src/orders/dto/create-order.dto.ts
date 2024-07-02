import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { StartsWith } from "src/utils/validators/starts-with.validator";
import { OrderStatus } from "../entities/order.entity";
import { CreatePaymentDto } from "src/payment/dto/create-payment.dto";
import CreateShippingDto from "src/shipping/dto/create-shipping.dto";
import CreateOrderItem from "../order-items/dto/create-order-item.dto";

export class CreateOrderDto {

    @Min(0)
    @IsNumber()
    @IsNotEmpty()
    total:number;

    @ValidateNested({
        each: true
    })
    @IsArray()
    orderItems:CreateOrderItem[]

    @StartsWith(ERecordPrefix.USER)
    @IsOptional()
    userId?:string


    @IsEnum(OrderStatus)
    status?: OrderStatus

    @ValidateNested({
        each: true
    })
    @IsOptional()
    shippingInfo?:CreateShippingDto[]

    @ValidateNested()
    @IsOptional()
    payment?:CreatePaymentDto

}
