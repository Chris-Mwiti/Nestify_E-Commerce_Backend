import { IsEnum, IsString } from "class-validator";
import { UserRole } from "src/users/entities/user.entity";
import z from 'zod'

export class AuthDto {
    @IsString()
    userId: string;

    @IsEnum(UserRole)
    role: UserRole
}

export const authDto = z.object({
    userId: z.string(),
    role:z.enum(["admin", "user"]).default("user")
})

export type TAuthDto = z.infer<typeof authDto>
