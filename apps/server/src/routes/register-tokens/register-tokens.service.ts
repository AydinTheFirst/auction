import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

@Injectable()
export class RegisterTokensService {
  constructor(private prisma: PrismaService) {}

  async create() {
    const registerToken = await this.prisma.registerToken.create({
      data: {
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });

    return registerToken;
  }

  async findAll() {
    const registerTokens = await this.prisma.registerToken.findMany();
    return registerTokens;
  }

  async findOne(id: string) {
    const registerToken = await this.prisma.registerToken.findUnique({
      where: { id },
    });

    if (!registerToken) throw new NotFoundException("Kayıt tokeni bulunamadı!");

    return registerToken;
  }

  async remove(id: string) {
    await this.findOne(id);

    const registerToken = await this.prisma.registerToken.delete({
      where: { id },
    });

    return registerToken;
  }
}
