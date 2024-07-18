import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable() 
export class UserValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {

        //Bypasses the validation step if the the metatype is a native javascript type or is not provided
        if(!metatype || !this.toValidate(metatype)){
            return value
        }

        //Converts the incoming object to a decorated object in order to be validated
        const object = plainToInstance(metatype, value);
        const errors =  await validate(object);

        if(errors.length > 0){
            throw new BadRequestException("Validation failed");
        }
    }

    //Validates to check whether the handler metatype exists within the provided context
    private toValidate(metatype: Function):boolean{
        const types:Function[] = [String, Function, Boolean, Number, Array, Object];
        return !types.includes(metatype)
    }
}

export default UserValidationPipe