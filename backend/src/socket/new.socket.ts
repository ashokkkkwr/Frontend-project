// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from 'url';

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "*"],
//     methods: ["GET", "POST"],
//   },
// });

// const userSocketMap: { [key: string]: string } = {}; // {userId: socketId}
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export const getReceiverSocketId = (receiverId: string) => {
//   return userSocketMap[receiverId];
// };

// console.log(userSocketMap, "SUSf");

// io.on("connection", (socket) => {
//   console.log("a user connected", socket.id);

//   const userId = socket.handshake.query.userId as string;
//   if (userId) userSocketMap[userId] = socket.id;

//   io.emit("getOnlineUsers", Object.keys(userSocketMap));


//   socket.on("disconnect", () => {
//     console.log("User disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     if (fileStream && !fileStream.closed) {
//       fileStream.end();
//     }
//   });
// });

// export { app, io, server };
