import express from 'express';
import {
  getEvents,
  createEvent,
  getEventById,
} from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getEvents);
router.get('/:id', getEventById);
router.post('/', protect, createEvent);

export default router;
