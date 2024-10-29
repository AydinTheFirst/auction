import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateProductDto, UpdateProductDto } from "./products.dto";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    delete createProductDto.notifyUsers;

    const product = await this.prisma.product.create({
      data: createProductDto,
    });

    return product;
  }

  async findAll() {
    const products = await this.prisma.product.findMany();
    return products;
  }

  async findAuctions(id: string) {
    const auctions = await this.prisma.auction.findMany({
      where: { productId: id },
    });

    return auctions;
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException("Ürün bulunamadı!");

    return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    const product = await this.prisma.product.delete({
      where: { id },
    });

    return product;
  }

  async search(query: string) {
    const products = await this.prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
    });

    return products;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    delete updateProductDto.notifyUsers;

    const product = this.prisma.product.update({
      data: updateProductDto,
      where: { id },
    });

    return product;
  }
}
