import { IsEnum, IsNotEmpty, IsNumber } from "class-validator";
import { PaymentType } from "../entities/payment.entity";
import { StartsWith } from "src/utils/validators/starts-with.validator";
import { ERecordPrefix } from "src/enums/recordId.enum";

export class CreatePaymentDto {

    @IsNumber()
    @IsNotEmpty()
    amount:number

    @IsEnum(PaymentType)
    paymentType:PaymentType

    @StartsWith(ERecordPrefix.ORDER)
    orderId:string;
}
