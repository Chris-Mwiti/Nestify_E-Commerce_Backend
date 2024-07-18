import { IsOptional, IsString } from "class-validator";
import { Category } from "src/category/entities/category.entity";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { Product } from "src/products/entities/product.entity";
import { StartsWith } from "src/utils/validators/starts-with.validator";


/**@todo: Create a validator that will ensure that each product added at the collection belongs to the categories defined */
export class CreateCollectionDto {

    @IsString()
    categoryName:string

    @StartsWith(ERecordPrefix.CATEGORY, {
        each: true
    })
    categoryIds:string[]

    @StartsWith(ERecordPrefix.PRODUCTS, {
        each: true
    })
    @IsOptional()
    productIds:string[]
}
