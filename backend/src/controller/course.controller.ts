import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { Request,Response } from 'express';


export const createCourse = async (req:Request, res:Response) => {
  try {
    const { course } = req.body;
    const { id } = req.params;
    const userExists = await prisma.user.findUnique({ where: { id: Number(id) } });
    if (!userExists) throw new Error('User does not exist');
    const newCourse = await prisma.courses.create({
      data: { course, userId: Number(id) },
    });
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error creating course' });
  }
};

export const getCoursesByUser = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const courses = await prisma.courses.findMany({ where: { userId: Number(id) } });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching courses' });
  }
};

export const getAllCourses = async (req:Request, res:Response) => {
  try {
    const allCourses = await prisma.courses.findMany();
    res.json(allCourses);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching courses' });
  }
};

export const updateCourse = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    const { course } = req.body;
    const updatedCourse = await prisma.courses.update({
      where: { id: Number(id) },
      data: { course },
    });
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(400).json({ message: 'Error updating course' });
  }
};

export const deleteCourse = async (req:Request, res:Response) => {
  try {
    const { id } = req.params;
    await prisma.courses.delete({ where: { id: Number(id) } });
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: 'Error deleting course' });
  }
};
