import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";
import { ERecordPrefix } from "src/enums/recordId.enum";
import { IsBuffer } from "src/utils/validators/buffer.validator";
import { StartsWith } from "src/utils/validators/starts-with.validator";
import { CreateProductMetaData } from "../products-metadata/dto/create-product-metadata.dto";

export class CreateProductDto extends PartialType(CreateProductMetaData) {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsBuffer()
  @IsOptional()
  productDescription?:Buffer

  @IsString()
  @IsNotEmpty()
  subDescription: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  sellingPrice: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  originalPrice: number;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  lowLevelAlert: number;

  @IsBoolean()
  isPerishable: boolean;

  @IsDateString()
  @IsOptional()
  expireDate?: Date;

  @IsString()
  @IsNotEmpty()
  productLabel: string;

  @IsString()
  @IsOptional()
  productCode?: string;

  @IsString()
  @IsOptional()
  productSku?: string;

  @IsString()
  @IsOptional()
  productBarCode?: string;

  @Min(0)
  @IsNumber()
  @IsNotEmpty()
  quantity:number;

  @StartsWith(ERecordPrefix.CATEGORY)
  @IsString()
  @IsNotEmpty()
  categoryId:string
}
