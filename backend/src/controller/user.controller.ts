import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import jwt from '../utils/webToken'

const prisma = new PrismaClient();

export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user = await prisma.user.create({
      data: { username, email, password },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({ where: { id: Number(id) } });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, email } = req.body;
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { username, email },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error while updating user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.user.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: "Error while deleting user" });
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, bio, address, phone } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists with this email" });
    }
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
        userDetails: {
          create: {
            bio,
            address,
            phone,
          },
        },
      },
      include: {
        userDetails: true,
      },
    });
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const details = await prisma.user.findMany({
      include: {
        userDetails: true,
      },
    });
    res.json(details);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Failed to fetch user details." });
  }
};
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { username, email, bio, address, phone } = req.body;
    const userId = parseInt(req.params.id);

    const update = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        username,
        email,
        userDetails: {
          update: {
            bio,
            address,
            phone,
          },
        },
      },
      include: {
        userDetails: true,
      },
    });
    res.json(update);
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ error: "Failed to update user details." });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const loggedInUserId=req.user?.id
    console.log("🚀 ~ changePassword ~ loggedInUserId:", loggedInUserId)

    const { password } = req.body;
    const { id } = req.params;
    const updatePassword = await prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        password,
      },
    });
    console.log("🚀 ~ app.patch ~ updatePassword:", updatePassword);
    res.status(204).send(updatePassword);
  } catch (error) {
    res.status(404).send(error);
  }
};
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password cannot be empty.");
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
        password
      },
    });

    if (!user) {
      return res.status(404).send('Invalid credentials');
    }

    const token = jwt.generateTokens({
      id: user.id.toString(),  
    });

    res.json({ user, token:{
      accessToken:token.accessToken,
      refreshToke: token.refreshToken,
    } });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    res.status(500).send("Internal server error");
  }
};

