import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from "@nestjs/common";

import { GetUser } from "@/common/decorators";

import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from "./notifications.dto";
import { NotificationsService } from "./notifications.service";

@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser("id") userId: string
  ) {
    return this.notificationsService.create(userId, createNotificationDto);
  }

  @Get()
  findAll(@GetUser("id") userId: string) {
    return this.notificationsService.findAll(userId);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.notificationsService.findOne(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.notificationsService.remove(id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateNotificationDto: UpdateNotificationDto
  ) {
    return this.notificationsService.update(id, updateNotificationDto);
  }
}
