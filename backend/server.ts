import { PrismaClient } from "@prisma/client";
import express from "express";
import userRoutes from "./src/routes/user.routes";
import chatRoutes from "./src/routes/chat.routes";
import cors from 'cors';
import http from 'http';
import { Server, io } from './src/socket/chat.socket'; 
import path from "path";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log("🚀 ~ express:", express)
const prisma = new PrismaClient();
app.use(
  cors({
    origin: "*",  
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Routes
app.use('/api', userRoutes);
app.use('/api', chatRoutes);

const server = http.createServer(app);
io.attach(server);
server.listen(4100, () => {
  console.log("🚀 ~ server.listen ~ 4200:", 4100);
  console.log("Server is running with Socket.io");
});
