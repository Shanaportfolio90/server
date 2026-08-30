import express from 'express';
import MediaContent from '../models/MediaContent.js';

const router = express.Router();

// Get All Published Media / Video Content for Portfolio Section
router.get('/', async (req, res) => {
  try {
    const mediaList = await MediaContent.find().sort({ createdAt: -1 });
    res.status(200).json(mediaList);
  } catch (error) {
    console.error('Error fetching media content:', error);
    res.status(500).json({ message: 'Failed to fetch media content.' });
  }
});

export default router;
