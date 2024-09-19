import express from 'express';
import {
  createCourse,
  getCoursesByUser,
  getAllCourses,
  updateCourse,
  deleteCourse,
} from '../controller/course.controller';

const router = express.Router();

router.post('/courses/:id', createCourse);
router.get('/courses/user/:id', getCoursesByUser);
router.get('/courses/all', getAllCourses);
router.patch('/courses/update/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

export default router;
