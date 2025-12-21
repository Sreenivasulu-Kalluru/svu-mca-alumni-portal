import { Request, Response } from 'express';
import { Job } from '../models/Job.js';

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { type, location, keyword } = req.query;

    let query: any = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (keyword) {
      query.$or = [
        { title: { $regex: keyword, $options: 'i' } },
        { company: { $regex: keyword, $options: 'i' } },
        { description: { $regex: keyword, $options: 'i' } },
        { skills: { $in: [new RegExp(keyword as string, 'i')] } },
      ];
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    console.error('Get Jobs Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a new job
// @route   POST /api/jobs
// @access  Private (Alumni/Admin only)
export const createJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      requirements,
      applicationLink,
      contactEmail,
    } = req.body;

    // Assuming req.user is populated by auth middleware (needs to be added to definition or casted)
    // For now, we'll assume the auth middleware adds user to req
    const userId = (req as any).user?._id;

    if (!userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      requirements,
      applicationLink,
      contactEmail,
      postedBy: userId,
    });

    res.status(201).json(job);
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
