import { IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  description: string;

  @IsString()
  title: string;

  @IsString()
  url: string;
}

export class UpdateNotificationDto extends CreateNotificationDto {}
