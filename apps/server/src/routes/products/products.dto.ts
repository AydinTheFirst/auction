import { IsBoolean, IsNumber, IsString } from "class-validator";

export class CreateProductDto {
  @IsString()
  description: string;

  @IsBoolean()
  isPublished: boolean;

  @IsBoolean()
  notifyUsers: boolean;

  @IsNumber()
  price: number;

  @IsNumber()
  startPrice: number;

  @IsString()
  title: string;
}

export class UpdateProductDto extends CreateProductDto {}
