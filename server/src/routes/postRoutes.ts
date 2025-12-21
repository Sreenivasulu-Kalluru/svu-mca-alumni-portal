import express from 'express';
import {
  getPosts,
  createPost,
  deletePost,
  likePost,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(protect, getPosts)
  .post(protect, upload.single('image'), createPost);

router.delete('/:id', protect, deletePost);
router.put('/:id/like', protect, likePost);

export default router;
