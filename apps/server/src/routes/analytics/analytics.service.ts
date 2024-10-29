import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async create(url: string, ip: string, userAgent: string) {
    if (!url) throw new BadRequestException("url is required!");
    if (!ip) throw new BadRequestException("ip is required!");
    if (!userAgent) throw new BadRequestException("userAgent is required!");

    const analytic = await this.prisma.analytic.findFirst({ where: { url } });

    if (!analytic)
      return this.prisma.analytic.create({
        data: {
          url,
          visits: {
            create: [{ ip, userAgent }],
          },
        },
      });

    const updated = await this.prisma.analytic.update({
      data: {
        visits: {
          create: [{ ip, userAgent }],
        },
      },
      include: { visits: true },
      where: { id: analytic.id },
    });

    return updated;
  }

  async findAll() {
    const analytics = await this.prisma.analytic.findMany({
      include: { visits: true },
    });

    return analytics;
  }

  async findOne(id: string) {
    const analytic = await this.prisma.analytic.findFirst({
      include: { visits: true },
      where: { OR: [{ id }, { url: id }] },
    });

    return analytic;
  }
}
