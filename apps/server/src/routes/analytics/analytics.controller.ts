import { Controller, Get, Param, Post, Req } from "@nestjs/common";
import { Request } from "express";

import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  create(@Req() req: Request) {
    const { url } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    return this.analyticsService.create(url, ip.toString(), userAgent);
  }

  @Get()
  findAll() {
    return this.analyticsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.analyticsService.findOne(id);
  }
}
