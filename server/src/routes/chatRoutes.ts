import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getConversations,
  getMessages,
  editMessage,
} from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/', protect, getConversations);
// Specific conversation messages
router.get('/:conversationId', protect, getMessages);
router.put('/:messageId', protect, editMessage);

export default router;
