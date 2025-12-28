import express from 'express';
import { sendMessage, getConversation } from '../controllers/chatController.js';

const router = express.Router();

router.post('/message', sendMessage);
router.get('/history/:sessionId', getConversation);

export default router;