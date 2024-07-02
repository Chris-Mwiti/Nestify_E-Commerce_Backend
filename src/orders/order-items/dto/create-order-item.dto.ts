import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { StartsWith } from "src/utils/validators/starts-with.validator";

export default class CreateOrderItem {

    @StartsWith(ERecordPrefix.PRODUCTS)
    @IsString()
    @IsNotEmpty()
    productId:string

    @Min(0)
    @IsNumber()
    quantity:number

    @Min(0)
    @IsNumber()
    price:number
}