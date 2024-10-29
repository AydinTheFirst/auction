import { Role } from "@prisma/client";
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
} from "class-validator";

export class CreateUserDto {}

export class UpdateUserDto extends CreateUserDto {
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

  @IsString()
  @IsOptional()
  password: string;

  @IsPhoneNumber("TR")
  phone: string;

  @IsOptional()
  roles: Role[];

  @IsOptional()
  username: string;
}
