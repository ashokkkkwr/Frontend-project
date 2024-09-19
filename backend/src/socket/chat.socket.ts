import { Server } from "socket.io";
import webToken from "../utils/webToken";
import { DotenvConfig } from "../config/env.config";
import http from "http";
import express from 'express'
const app = express();

const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST", "PATCH", "DELETE", "PUT", "OPTIONS"],
    },
  });

  const socketToUserIdMap: Map<string, string> = new Map()

  io.use((socket,next)=>{
    const token = socket.handshake.auth.token;
    console.log("🚀 ~ io.use ~ token:", token)
    if(!token){
        console.log("🚀 token not found. ", token)  
    }
    try{
        const payload = webToken.verify(token,DotenvConfig.ACCESS_TOKEN_SECRET)
        console.log("🚀 ~ io.use ~ payload:", payload)
        if(payload){
            socket.data.user = payload
            next();
        }else{
            console.log('not found.') }
        
    }catch(error){
        console.log("🚀 ~ io.use ~ error:", error)
    }
  })

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    const userId= socket.data.user.id
     socketToUserIdMap.set(userId,socket.id);
     console.log(socketToUserIdMap,'haha')


   

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    //   socketToUserIdMap.delete(socket.id);
    });
  });

export const getReceiverSocketId = (receiverId: string) => {
console.log(socketToUserIdMap,"socket user map")
const socketId = socketToUserIdMap.get(receiverId)
console.log(socketId,"SocketID")
return socketId
};
export { Server,io };

   
