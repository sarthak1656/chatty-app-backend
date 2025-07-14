import { Server } from "socket.io";
import http from "http";
import express from "express";

// Express app and HTTP server
const app = express();
const server = http.createServer(app);

// 🌐 Replace/add your frontend URLs here
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://chatty-app-frontend-iota.vercel.app",
    ],
    credentials: true,
  },
});
// Map to track connected users
const userSocketMap = {}; // { userId: socketId }

// 🧠 Utility to get a socketId by userId
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// 🔌 Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // 🔌 Handle disconnect
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

export { io, app, server };
