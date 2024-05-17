import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { ERecordPrefix } from "src/enums/recordId.enum";

@ValidatorConstraint({ async: false})
export class StartsWithConstraint implements ValidatorConstraintInterface {
    validate(value: any, validationArguments?: ValidationArguments): boolean | Promise<boolean> {
        const [ prefix ] = validationArguments?.constraints;
        return typeof value === 'string' && value.startsWith(prefix);
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        const [ prefix ] = validationArguments.constraints
        return `Text must start with ${prefix}`
    }
}

export function StartsWith(prefix:ERecordPrefix, validationOptions?:ValidationOptions) {
    return function(object:Object, propertyName:string){
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [prefix],
            validator: StartsWithConstraint
        })
    }
}