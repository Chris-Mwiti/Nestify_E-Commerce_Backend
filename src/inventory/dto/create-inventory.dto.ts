import { IsNotEmpty, IsNumber } from "class-validator";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { StartsWith } from "src/utils/validators/starts-with.validator";

export class CreateInventoryDto {
    @IsNumber()
    @IsNotEmpty()
    quantity:number;

    @StartsWith(ERecordPrefix.PRODUCTS)
    @IsNotEmpty()
    productId:string;
}
