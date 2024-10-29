import { Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "@/prisma";

import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "./notifications.dto";

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        ...createNotificationDto,
        userId,
      },
    });

    return notification;
  }

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: { userId },
    });

    return notifications;
  }

  async findOne(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });

    if (!notification) throw new NotFoundException("Bildirim bulunamadı!");

    const updated = await this.prisma.notification.update({
      data: { isSeen: true },
      where: { id },
    });

    return updated;
  }

  async remove(id: string) {
    await this.findOne(id);

    const notification = await this.prisma.notification.delete({
      where: { id },
    });

    return notification;
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto) {
    await this.findOne(id);

    const notification = this.prisma.notification.update({
      data: updateNotificationDto,
      where: { id },
    });

    return notification;
  }
}
