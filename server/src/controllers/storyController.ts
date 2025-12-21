import { Request, Response } from 'express';
import SuccessStory from '../models/SuccessStory.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

// @desc    Get all approved stories
// @route   GET /api/stories
// @access  Public
export const getStories = async (req: Request, res: Response) => {
  try {
    const stories = await SuccessStory.find({ status: 'approved' })
      .sort({ createdAt: -1 })
      .populate('user', 'name profilePicture');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a success story
// @route   POST /api/stories
// @access  Private
export const createStory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, role, company, content, image, linkedinProfile } = req.body;

    const story = await SuccessStory.create({
      user: req.user?._id,
      name,
      role,
      company,
      content,
      image: (req as any).file ? `/uploads/${(req as any).file.filename}` : image,
      linkedinProfile,
      status: 'approved', // Explicitly auto-approve
    });

    res.status(201).json(story);
  } catch (error) {
    console.error('Error creating story:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};
