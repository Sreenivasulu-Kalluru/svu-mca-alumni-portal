import express from 'express';
import { getStories, createStory } from '../controllers/storyController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../middleware/uploadMiddleware';

const router = express.Router();

router
  .route('/')
  .get(getStories)
  .post(protect, upload.single('image'), createStory);

export default router;
