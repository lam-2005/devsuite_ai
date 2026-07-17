import { Server } from "socket.io";
import http from "http";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("socket id: ", socket.id);

  socket.on("join_error_group", (errorGroupId: string) => {
    socket.join(errorGroupId);

    console.log(`${socket.id} joined ${errorGroupId}`);
  });

  socket.on("leave_error_group", (errorGroupId: string) => {
    socket.leave(errorGroupId);

    console.log(`${socket.id} left ${errorGroupId}`);
  });

  socket.on("disconnect", () => console.log("Socket disconnect"));
});

export { io, server };
