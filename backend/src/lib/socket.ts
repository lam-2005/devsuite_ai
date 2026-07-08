import { Server } from "socket.io";
import http from "http";
import express from "express";
import ENV from "../config/env.js";
import app from "../app.js";

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", (socket) => {
  console.log("socket id: ", socket.id);

  socket.on("join_error_group", (EGId) => {
    socket.join(EGId);
    console.log("Joined room: ", EGId);
  });

  socket.on("disconnect", () => console.log("Socket disconnect"));
});

export { io, server };
