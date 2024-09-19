import express from 'express';
import {
  sendChat,
  getMessages
} from '../controller/chat.controller';
import { authentication } from '../middleware/authentication.middleware';
import upload from '../utils/fileUpload';
const router = express.Router();
router.post('/chat/send',authentication(),upload.array('files'), sendChat);
router.get('/chat/:id',authentication(),getMessages)
export default router;