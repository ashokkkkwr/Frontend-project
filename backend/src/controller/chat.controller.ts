import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { io, getReceiverSocketId } from "../socket/chat.socket";
import Redis = require("redis");
const redisClient = Redis.createClient();
const DEFAULT_EXPIRATION = 10;
redisClient.connect().catch(console.error);
const prisma = new PrismaClient();
export const sendChat = async (req: Request, res: Response) => {
  try {
    const senderId = req.user?.id;
    const { receiverId, content } = req.body;
    if (!receiverId || !senderId) {
      return res
        .status(400)
        .json({ message: "Receiver ID, content, and sender ID are required" });
    }
    // Construct the file URL for each uploaded file
    const uploadedFiles = req.files?.map((file: any) => ({
      name: file.originalname,
      filePath: `http://localhost:4100/uploads/temp/${file.filename}`,
      mimeType: file.mimetype
    }))
    // Create a new message
    const messageSave = await prisma.message.create({
      data: {
        content,
        sender: {
          connect: { id: Number(senderId) },
        },
        receiver: {
          connect: { id: Number(receiverId) },
        },
        medias: {
          create: uploadedFiles || [],
        },
      },
      include: {
        sender: true,
        receiver: true,
        medias: true,
      },
    });
    // Emit the message to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", messageSave);
    }
    res.status(201).json({
      message: "Message sent successfully",
      data: messageSave,
    });
  } catch (error) {
    console.error("Error sending chat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id; // Current authenticated user's ID
    const { id: receiverId } = req.params; // ID of the receiver

    const allChats = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: Number(userId), receiverId: parseInt(receiverId) },
          { senderId: parseInt(receiverId), receiverId: Number(userId) },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            email: true,
            userDetails: true,
          },
        },
        receiver: {
          select: {
            id: true,
            username: true,
            email: true,
            userDetails: true,
          },
        },
        medias: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formattedChats = allChats.map((chat) => ({
      ...chat,
      medias: chat.medias.map((media) => ({
        id: media.id,
        name: media.name,

        filePath: `${media.filePath}`,
        mimeType: media.mimeType,
      })),
    }));
    try {
      const chats = await redisClient.get("chats");
      console.log("🚀 ~ getMessages ~ chats:", chats)
      if (chats != null) {
        console.log("🚀 ~ getMessages ~ chats:", chats)
        console.log("fetched from redis");
        return res.json(JSON.parse(chats));
      } else {
        console.log(JSON.stringify(formattedChats),"haha")
        await redisClient.setEx("chats",DEFAULT_EXPIRATION,JSON.stringify(formattedChats))
        res.status(200).json(formattedChats);
        console.log("fetched from api.");
      }
    } catch (error) {
      console.log("🚀 ~ getMessages ~ error:", error)
      res.status(404).json(error);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};