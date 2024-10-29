import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { GetUser } from "@/common/decorators";

import { CreateOfferDto, UpdateOfferDto } from "./offers.dto";
import { OffersService } from "./offers.service";

@Controller("offers")
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(
    @GetUser("id") userId: string,
    @Body() createOfferDto: CreateOfferDto
  ) {
    return this.offersService.create(userId, createOfferDto);
  }

  @Get()
  findAll() {
    return this.offersService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.offersService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.offersService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateOfferDto: UpdateOfferDto) {
    return this.offersService.update(id, updateOfferDto);
  }
}
