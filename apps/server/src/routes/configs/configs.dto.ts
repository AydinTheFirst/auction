import { IsString } from "class-validator";

export class CreateConfigDto {
  @IsString()
  description: string;

  @IsString()
  key: string;

  @IsString()
  title: string;

  @IsString()
  value: string;
}

export class UpdateConfigDto extends CreateConfigDto {}
