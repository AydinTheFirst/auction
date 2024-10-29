import { Logger, OnModuleInit } from "@nestjs/common";
import { WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

import { PrismaService } from "@/prisma";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  transports: ["websocket"],
})
export class WebsocketGateway implements OnModuleInit {
  private connectedSockets = new Map<string, any>();

  @WebSocketServer()
  io: Server;

  constructor(private prisma: PrismaService) {}

  onModuleInit() {
    this.io.on("connection", (socket) => {
      Logger.debug(`Client connected: ${socket.id}`, "WebsocketGateway");
      this.connectedSockets.set(socket.id, socket);

      socket.on("auction:join", (id) => {
        socket.join(`auction:${id}`);
      });

      socket.on("auction:leave", (id) => {
        socket.leave(`auction:${id}`);
      });

      socket.on("disconnect", () => {
        this.connectedSockets.delete(socket.id);
        Logger.debug(`Client disconnected: ${socket.id}`, "WebsocketGateway");
      });
    });
  }
}
