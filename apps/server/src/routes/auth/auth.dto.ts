import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsStrongPassword,
  Length,
} from "class-validator";

export class LoginDto {
  @IsString()
  password: string;

  @IsString()
  username: string;
}

export class RegisterDto extends LoginDto {
  @IsString()
  @IsOptional()
  address: string;

  @IsDateString()
  birthDate: string;

  @IsEmail()
  email: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Length(11, 11)
  nationalId: string;

  @IsStrongPassword()
  password: string;

  @IsPhoneNumber("TR")
  phone: string;

  @IsOptional()
  username: string;
}
