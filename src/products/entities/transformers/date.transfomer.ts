import { Logger } from "@nestjs/common";
import { ValueTransformer } from "typeorm";

export class DateTransformer implements ValueTransformer {
    private logger:Logger = new Logger(DateTransformer.name);

    to(value: string | undefined):Date | null {
        if(!value) return null

        const stringDate = new Date(value);

        return stringDate
    }

    from(value: Date | null):string | undefined {
        if(!value) return undefined;
        const dateString = value.toLocaleString();

        return dateString
    }
}