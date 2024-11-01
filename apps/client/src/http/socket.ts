import { io } from "socket.io-client";

import { API_URL } from "@/config";

export const socket = io(API_URL.replace("/api", ""), {
  autoConnect: false,
  transports: ["websocket"],
});
