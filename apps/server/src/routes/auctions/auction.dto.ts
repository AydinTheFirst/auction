import { IsNumber, IsString } from "class-validator";

export class CreateAuctionDto {
  @IsNumber()
  duration: number;

  @IsString()
  name: string;

  @IsString()
  productId: string;
}

export class UpdateAuctionDto extends CreateAuctionDto {}
