import { Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateConfigDto, UpdateConfigDto } from "./configs.dto";

@Injectable()
export class ConfigsService {
  constructor(private prisma: PrismaService) {}
  async create(createConfigDto: CreateConfigDto) {
    const config = await this.prisma.config.create({
      data: createConfigDto,
    });
    return config;
  }

  async findAll() {
    const configs = await this.prisma.config.findMany();
    return configs;
  }

  async findByKey(key: string) {
    const config = await this.prisma.config.findUnique({ where: { key } });
    if (!config) throw new Error("Bu ayar bulunamadı!");
    return config;
  }

  async findOne(id: string) {
    const config = await this.prisma.config.findUnique({ where: { id } });

    if (!config) throw new Error("Ayar bulunamadı!");

    return config;
  }

  async remove(id: string) {
    await this.findOne(id);
    const config = await this.prisma.config.delete({ where: { id } });
    return config;
  }

  async update(id: string, updateConfigDto: UpdateConfigDto) {
    await this.findOne(id);

    const config = this.prisma.config.update({
      data: updateConfigDto,
      where: { id },
    });

    return config;
  }
}
