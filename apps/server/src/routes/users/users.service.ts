import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import argon from "argon2";

import { PrismaService } from "@/prisma";

import { UpdateUserDto } from "./users.dto";

@Injectable()
export class UsersService {
  create = async () => {
    throw new BadRequestException("Not implemented");
  };

  findAll = async () => {
    const users = await this.prisma.user.findMany();
    return users;
  };

  findOne = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user;
  };

  remove = async (id: string) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    await this.prisma.user.delete({
      where: {
        id: id,
      },
    });

    return user;
  };

  update = async (id: string, updateUserDto: UpdateUserDto) => {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) throw new NotFoundException("User not found");

    if (updateUserDto.password && updateUserDto.password !== user.password) {
      updateUserDto.password = await argon.hash(updateUserDto.password);
    }

    await this.prisma.user.update({
      data: {
        ...updateUserDto,
        birthDate: new Date(updateUserDto.birthDate),
      },
      where: {
        id: id,
      },
    });

    return user;
  };

  constructor(private prisma: PrismaService) {}
}
