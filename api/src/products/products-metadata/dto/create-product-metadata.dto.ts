import { IsArray, IsOptional, ValidateNested } from "class-validator";
import { SizesMetaData } from "./sizes-metadata.dto";

export class CreateProductMetaData {

  @ValidateNested({
    each: true
  })  
  @IsArray()
  @IsOptional()
  sizes: SizesMetaData[];

  @IsArray()
  @IsOptional()
  color: string[];

  @IsArray()
  @IsOptional()
  imageUrl: string[];
}