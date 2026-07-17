import { io, Socket } from "socket.io-client";
import ENV from "./environment";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(ENV.BASE_API_URL!, {
      transports: ["websocket"],
      autoConnect: false,
      withCredentials: true,
    });
  }

  return socket;
};
