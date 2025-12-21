import express from 'express';
import { getJobs, createJob } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.post('/', protect, createJob);

export default router;
