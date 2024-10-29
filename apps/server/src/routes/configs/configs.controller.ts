import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateConfigDto, UpdateConfigDto } from "./configs.dto";
import { ConfigsService } from "./configs.service";

@Controller("configs")
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  create(@Body() createConfigDto: CreateConfigDto) {
    return this.configsService.create(createConfigDto);
  }

  @Get()
  findAll() {
    return this.configsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.configsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.configsService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateConfigDto: UpdateConfigDto) {
    return this.configsService.update(id, updateConfigDto);
  }
}
