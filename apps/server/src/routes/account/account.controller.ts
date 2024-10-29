import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { CreateAccountDto, UpdateAccountDto } from "./account.dto";
import { AccountService } from "./account.service";

@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.accountService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.accountService.remove(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountService.update(id, updateAccountDto);
  }
}
