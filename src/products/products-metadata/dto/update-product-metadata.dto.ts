import { PartialType } from "@nestjs/mapped-types";
import { CreateProductMetaData } from "./create-product-metadata.dto";
import { IsNotEmpty } from "class-validator";
import { StartsWith } from "src/utils/validators/starts-with.validator";
import { ERecordPrefix } from "src/enums/recordId.enum";

export class UpdateProductMetaData extends PartialType(CreateProductMetaData) {
    
    @StartsWith(ERecordPrefix.PRODUCTS)
    @IsNotEmpty()
    productId:string
}