import { Module } from "@nestjs/common";

import { WebsocketModule } from "@/websocket";

import { OffersController } from "./offers.controller";
import { OffersService } from "./offers.service";

@Module({
  controllers: [OffersController],
  imports: [WebsocketModule],
  providers: [OffersService],
})
export class OffersModule {}
