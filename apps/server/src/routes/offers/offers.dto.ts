import { IsNumber, IsString } from "class-validator";

export class CreateOfferDto {
  @IsString()
  auctionId: string;

  @IsNumber()
  offer: number;
}

export class UpdateOfferDto extends CreateOfferDto {}
