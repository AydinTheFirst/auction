import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { PrismaService } from "@/prisma";
import { WebsocketGateway } from "@/websocket";

import { CreateOfferDto, UpdateOfferDto } from "./offers.dto";

@Injectable()
export class OffersService {
  constructor(
    private prisma: PrismaService,
    private ws: WebsocketGateway
  ) {}

  async create(userId: string, createOfferDto: CreateOfferDto) {
    const auction = await this.prisma.auction.findUnique({
      where: { id: createOfferDto.auctionId },
    });

    if (!auction) throw new NotFoundException("Açık arttırma bulunamadı!");

    if (auction.endAt < new Date())
      throw new NotFoundException("Açık arttırma sona erdi!");

    const product = await this.prisma.product.findUnique({
      where: { id: auction.productId },
    });

    if (!product) throw new NotFoundException("Ürün bulunamadı!");

    const offers = await this.prisma.offer.findMany({
      where: { auctionId: createOfferDto.auctionId },
    });

    const minimumOffer =
      offers.length > 0
        ? Math.max(...offers.map((o) => o.offer))
        : product.startPrice;

    if (createOfferDto.offer < minimumOffer + 100) {
      throw new BadRequestException(
        `En düşük (${minimumOffer + 100})₺ teklif vermelisiniz.`
      );
    }

    const offer = await this.prisma.offer.create({
      data: {
        ...createOfferDto,
        userId,
      },
    });

    // her teklif verildiğinde açık arttırmayı 15 saniye uzat

    const newEndAt = new Date(auction.endAt);
    newEndAt.setSeconds(newEndAt.getSeconds() + 15);

    await this.prisma.auction.update({
      data: {
        endAt: newEndAt,
      },
      where: { id: auction.id },
    });

    // socket emit
    this.ws.io.to(`auction:${auction.id}`).emit("new-offer", {
      offer,
    });

    return offer;
  }

  async findAll() {
    const offers = await this.prisma.offer.findMany();
    return offers;
  }

  async findOne(id: string) {
    const offer = await this.prisma.offer.findUnique({ where: { id } });

    if (!offer) throw new NotFoundException("Teklif bulunamadı!");

    return offer;
  }

  async remove(id: string) {
    await this.findOne(id);

    const offer = await this.prisma.offer.delete({ where: { id } });

    return offer;
  }

  async update(id: string, updateOfferDto: UpdateOfferDto) {
    await this.findOne(id);

    const offer = await this.prisma.offer.update({
      data: updateOfferDto,
      where: { id },
    });

    return offer;
  }
}
