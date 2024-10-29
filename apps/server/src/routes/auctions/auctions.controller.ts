import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateAuctionDto, UpdateAuctionDto } from "./auction.dto";
import { AuctionsService } from "./auctions.service";

@Controller("auctions")
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post()
  create(@Body() createAuctionDto: CreateAuctionDto) {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get()
  findAll() {
    return this.auctionsService.findAll();
  }

  @Get(":id/offers")
  findOffers(@Param("id") id: string) {
    return this.auctionsService.findOffers(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.auctionsService.findOne(id);
  }

  @Get(":id/winner")
  findWinner(@Param("id") id: string) {
    return this.auctionsService.findWinner(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.auctionsService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAuctionDto: UpdateAuctionDto) {
    return this.auctionsService.update(id, updateAuctionDto);
  }
}
