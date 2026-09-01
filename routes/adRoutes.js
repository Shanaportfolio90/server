import express from 'express';
import Ad from '../models/Ad.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// GET /api/ads - Get active ads for public display
router.get('/ads', async (req, res) => {
  try {
    const ads = await Ad.find({ active: true }).sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error fetching active ads:', error);
    res.status(500).json({ message: 'Failed to fetch active ads.' });
  }
});

// GET /api/admin/ads - Get all ads for admin panel
router.get('/admin/ads', verifyAdmin, async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.status(200).json(ads);
  } catch (error) {
    console.error('Error fetching admin ads:', error);
    res.status(500).json({ message: 'Failed to fetch ads.' });
  }
});

// POST /api/admin/ads - Create new ad
router.post('/admin/ads', verifyAdmin, async (req, res) => {
  try {
    const { title, tagline, imageUrl, link, badgeText, active } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: 'Title and Image URL are required.' });
    }

    const newAd = new Ad({
      title,
      tagline: tagline || '',
      imageUrl,
      link: link || '#',
      badgeText: badgeText || 'Sponsored',
      active: active !== undefined ? active : true,
    });

    await newAd.save();
    res.status(201).json({ message: 'Advertisement created successfully!', ad: newAd });
  } catch (error) {
    console.error('Error creating ad:', error);
    res.status(500).json({ message: 'Failed to create advertisement.' });
  }
});

// PUT /api/admin/ads/:id - Update existing ad
router.put('/admin/ads/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, tagline, imageUrl, link, badgeText, active } = req.body;
    const updatedAd = await Ad.findByIdAndUpdate(
      req.params.id,
      { title, tagline, imageUrl, link, badgeText, active },
      { new: true }
    );

    if (!updatedAd) {
      return res.status(404).json({ message: 'Advertisement not found.' });
    }

    res.status(200).json({ message: 'Advertisement updated successfully!', ad: updatedAd });
  } catch (error) {
    console.error('Error updating ad:', error);
    res.status(500).json({ message: 'Failed to update advertisement.' });
  }
});

// DELETE /api/admin/ads/:id - Delete ad
router.delete('/admin/ads/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedAd = await Ad.findByIdAndDelete(req.params.id);
    if (!deletedAd) {
      return res.status(404).json({ message: 'Advertisement not found.' });
    }
    res.status(200).json({ message: 'Advertisement deleted successfully!' });
  } catch (error) {
    console.error('Error deleting ad:', error);
    res.status(500).json({ message: 'Failed to delete advertisement.' });
  }
});

export default router;
