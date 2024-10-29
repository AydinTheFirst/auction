import { BadRequestException, Injectable } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import { CreateAuctionDto, UpdateAuctionDto } from "./auction.dto";

@Injectable()
export class AuctionsService {
  constructor(private prisma: PrismaService) {}

  async create(createAuctionDto: CreateAuctionDto) {
    const auction = await this.prisma.auction.create({
      data: {
        ...createAuctionDto,
        endAt: new Date(Date.now() + createAuctionDto.duration),
        startedAt: new Date(),
      },
    });

    return auction;
  }

  async findAll() {
    const auctions = await this.prisma.auction.findMany();
    return auctions;
  }

  async findOffers(id: string) {
    const offers = await this.prisma.offer.findMany({
      where: { auctionId: id },
    });
    return offers;
  }

  async findOne(id: string) {
    const auction = await this.prisma.auction.findUnique({ where: { id } });

    if (!auction) throw new Error("Açık arttırma bulunamadı!");

    return auction;
  }

  async findWinner(id: string) {
    const auction = await this.findOne(id);

    if (auction.isWinnerSelected) {
      const winner = await this.prisma.user.findUnique({
        where: { id: auction.winnerId },
      });

      const winningOffer = await this.prisma.offer.findUnique({
        where: { id: auction.winningOfferId },
      });

      return {
        ...auction,
        offer: winningOffer,
        user: winner,
      };
    }

    if (auction.endAt > new Date()) {
      throw new BadRequestException("Açık arttırma henüz bitmedi!");
    }

    const offers = await this.findOffers(id);

    if (offers.length === 0) {
      throw new BadRequestException("Açık arttırmaya hiç teklif yapılmadı!");
    }

    const winningOffer = offers.reduce((prev, current) =>
      prev.offer > current.offer ? prev : current
    );

    if (!winningOffer) {
      throw new BadRequestException("Kazanan teklif bulunamadı!");
    }

    const winner = await this.prisma.user.findUnique({
      where: { id: winningOffer.userId },
    });

    if (!winner) {
      throw new BadRequestException("Kazanan kullanıcı bulunamadı!");
    }

    await this.prisma.auction.update({
      data: {
        isWinnerSelected: true,
        winnerId: winner.id,
        winningOfferId: winningOffer.id,
      },
      where: { id },
    });

    return {
      ...auction,
      offer: winningOffer,
      user: winner,
    };
  }

  async remove(id: string) {
    await this.findOne(id);

    const auction = await this.prisma.auction.delete({ where: { id } });
    return auction;
  }

  async update(id: string, updateAuctionDto: UpdateAuctionDto) {
    await this.findOne(id);

    const auction = this.prisma.auction.update({
      data: {
        ...updateAuctionDto,
        endAt: new Date(Date.now() + updateAuctionDto.duration),
      },
      where: { id },
    });

    return auction;
  }
}
