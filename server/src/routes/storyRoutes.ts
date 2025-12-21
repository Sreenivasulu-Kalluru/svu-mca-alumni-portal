import express from 'express';
import { getStories, createStory } from '../controllers/storyController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(getStories)
  .post(protect, upload.single('image'), createStory);

export default router;
