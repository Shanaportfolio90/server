import express from 'express';
import CollabCard from '../models/CollabCard.js';
import { verifyAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get All Collab Cards
const getCollabs = async (req, res) => {
  try {
    const cards = await CollabCard.find().sort({ createdAt: -1 });
    res.status(200).json(cards);
  } catch (error) {
    console.error('Error fetching collab cards:', error);
    res.status(500).json({ message: 'Failed to fetch collab cards.' });
  }
};

// Create Collab Card
const createCollab = async (req, res) => {
  try {
    const {
      brandName,
      category,
      title,
      description,
      websiteUrl,
      displayUrl,
      ctaButtonText,
      hasActionCta,
      actionCtaTitle,
      actionCtaSubtitle,
      actionCtaBtnText,
      actionCtaLink,
      imageUrl,
      tags,
      isFeatured,
    } = req.body;

    if (!brandName || !category || !title || !imageUrl) {
      return res.status(400).json({ message: 'Please provide brand name, category, title, and card image.' });
    }

    const newCard = new CollabCard({
      brandName,
      category,
      title,
      description: description || '',
      websiteUrl: websiteUrl || '#',
      displayUrl: displayUrl || '',
      ctaButtonText: ctaButtonText || '',
      hasActionCta: Boolean(hasActionCta),
      actionCtaTitle: actionCtaTitle || '',
      actionCtaSubtitle: actionCtaSubtitle || '',
      actionCtaBtnText: actionCtaBtnText || '',
      actionCtaLink: actionCtaLink || '',
      imageUrl,
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
    });

    await newCard.save();
    res.status(201).json({ message: 'Collab card created successfully!', card: newCard });
  } catch (error) {
    console.error('Error creating collab card:', error);
    res.status(500).json({ message: 'Failed to create collab card.' });
  }
};

// Update Collab Card
const updateCollab = async (req, res) => {
  try {
    const {
      brandName,
      category,
      title,
      description,
      websiteUrl,
      displayUrl,
      ctaButtonText,
      hasActionCta,
      actionCtaTitle,
      actionCtaSubtitle,
      actionCtaBtnText,
      actionCtaLink,
      imageUrl,
      tags,
      isFeatured,
    } = req.body;

    if (!brandName || !category || !title || !imageUrl) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const updatedCard = await CollabCard.findByIdAndUpdate(
      req.params.id,
      {
        brandName,
        category,
        title,
        description: description || '',
        websiteUrl: websiteUrl || '#',
        displayUrl: displayUrl || '',
        ctaButtonText: ctaButtonText || '',
        hasActionCta: Boolean(hasActionCta),
        actionCtaTitle: actionCtaTitle || '',
        actionCtaSubtitle: actionCtaSubtitle || '',
        actionCtaBtnText: actionCtaBtnText || '',
        actionCtaLink: actionCtaLink || '',
        imageUrl,
        tags: Array.isArray(tags) ? tags : [],
        isFeatured: Boolean(isFeatured),
      },
      { new: true }
    );

    if (!updatedCard) {
      return res.status(404).json({ message: 'Collab card not found.' });
    }

    res.status(200).json({ message: 'Collab card updated successfully!', card: updatedCard });
  } catch (error) {
    console.error('Error updating collab card:', error);
    res.status(500).json({ message: 'Failed to update collab card.' });
  }
};

// Delete Collab Card
const deleteCollab = async (req, res) => {
  try {
    await CollabCard.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Collab card deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete collab card.' });
  }
};

// Map routes for /api/collabs and /api/admin/collabs
router.get('/', getCollabs);
router.get('/admin', getCollabs);

router.post('/', verifyAdmin, createCollab);
router.post('/admin', verifyAdmin, createCollab);

router.put('/:id', verifyAdmin, updateCollab);
router.put('/admin/:id', verifyAdmin, updateCollab);

router.delete('/:id', verifyAdmin, deleteCollab);
router.delete('/admin/:id', verifyAdmin, deleteCollab);

export default router;
