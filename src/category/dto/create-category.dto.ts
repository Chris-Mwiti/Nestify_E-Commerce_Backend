import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

/**
 * @todo: 
 * 1. Add Description Buffer
 */
export class CreateCategoryDto {

    @IsString()
    @IsNotEmpty({
        message: "Category name is required"
    })
    categoryName:string;


    @IsString()
    @IsNotEmpty()
    categoryDescription:string;

    @IsString()
    @IsOptional()
    parentId?: string;

}
