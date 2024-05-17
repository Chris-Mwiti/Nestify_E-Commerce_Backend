import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

@ValidatorConstraint({ async: false })
export class IsBufferConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        return Buffer.isBuffer(value)
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'The value provided must be a buffer'
    }
}

export function IsBuffer(validationOptions?:ValidationOptions) {
    return function (object:Object, propertyName:string){
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsBufferConstraint
        })
    }
}

