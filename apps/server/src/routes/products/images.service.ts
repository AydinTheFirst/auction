import { BadRequestException, Injectable } from "@nestjs/common";

import { AWS } from "@/lib/aws";
import { PrismaService } from "@/prisma";

@Injectable()
export class ProductImagesService {
  constructor(private prisma: PrismaService) {}

  async deleteImage(productId: string, image: string) {
    const product = await this.findProduct(productId);

    await AWS.deleteFile(image);

    const images = product.images.filter((img) => img !== image);

    await this.prisma.product.update({
      data: {
        images: {
          set: images,
        },
      },
      where: { id: productId },
    });

    return image;
  }

  async findProduct(productId: string) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new BadRequestException("Product not found");
    }

    return product;
  }

  async updateImages(productId: string, images: string[]) {
    await this.findProduct(productId);
    console.log(images);
    await this.prisma.product.update({
      data: {
        images: {
          set: images,
        },
      },
      where: { id: productId },
    });

    return images;
  }

  async uploadImages(productId: string, images: Express.Multer.File[]) {
    await this.findProduct(productId);

    if (!images) throw new BadRequestException("Resim yükleyiniz!");

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageUrl = await AWS.uploadFile(image);

        return imageUrl;
      })
    );

    await this.prisma.product.update({
      data: {
        images: {
          push: imageUrls,
        },
      },
      where: { id: productId },
    });

    return imageUrls;
  }
}
