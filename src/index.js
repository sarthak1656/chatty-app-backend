import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

// ✅ Middleware
app.use(express.json({ limit: "10mb" })); // Supports large base64 strings

app.use(cookieParser());

// ✅ CORS: allow both local and deployed frontend
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local dev
      "https://chat-app-frontend-l6g2.vercel.app", // deployed Vercel frontend
    ],
    credentials: true, // Required to send cookies
  })
);

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ✅ Server Start
server.listen(process.env.PORT, () => {
  console.log("Server is running on PORT: " + process.env.PORT);
  connectDB();
});
