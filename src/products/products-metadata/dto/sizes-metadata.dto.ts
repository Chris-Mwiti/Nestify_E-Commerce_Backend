import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class SizesMetaData {
    @IsString()
    @IsNotEmpty()
    size:string;

    @Min(0)
    @IsNumber()
    quantity:number;

    @Min(0)
    @IsNumber()
    price:number;
}