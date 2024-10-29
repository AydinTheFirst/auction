import { Controller, Delete, Get, Param, Post } from "@nestjs/common";

import { RegisterTokensService } from "./register-tokens.service";

@Controller("register-tokens")
export class RegisterTokensController {
  constructor(private readonly registerTokensService: RegisterTokensService) {}

  @Post()
  create() {
    return this.registerTokensService.create();
  }

  @Get()
  findAll() {
    return this.registerTokensService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.registerTokensService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.registerTokensService.remove(id);
  }
}
