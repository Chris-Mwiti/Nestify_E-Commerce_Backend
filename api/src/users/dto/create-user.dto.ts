import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Min } from "class-validator";

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  // @Min(5, {
  //   message(validationArguments) {
  //     return (
  //       'Your password is too short. We expected it to be atleast' +
  //       validationArguments.constraints[0]
  //     );
  //   },
  // })
  @IsString()
  @IsOptional()
  password: string;

  @IsPhoneNumber('KE')
  phone: string;

  @IsString()
  @IsOptional()
  avatarUrl: string;

  @IsString()
  @IsOptional()
  profileUrl: string;

  @IsString()
  @IsOptional()
  googleId: string;
}
