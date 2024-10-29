import { Injectable } from "@nestjs/common";

import { CreateAccountDto, UpdateAccountDto } from "./account.dto";

@Injectable()
export class AccountService {
  create(createAccountDto: CreateAccountDto) {
    return "This action adds a new account";
  }

  findAll() {
    return `This action returns all account`;
  }

  findOne(id: string) {
    return `This action returns a #${id} account`;
  }

  remove(id: string) {
    return `This action removes a #${id} account`;
  }

  update(id: string, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }
}
