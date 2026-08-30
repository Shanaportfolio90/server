import express from 'express';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Submit Brand Collaboration Inquiry Form
router.post('/', async (req, res) => {
  try {
    const {
      brandName,
      brandWebsite,
      contactName,
      contactDesignation,
      contactEmail,
      phoneNo,
      connectPurpose,
      promotionalBudget,
    } = req.body;

    if (!brandName || !contactName || !contactEmail || !phoneNo) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const newInquiry = new Inquiry({
      brandName,
      brandWebsite,
      contactName,
      contactDesignation,
      contactEmail,
      phoneNo,
      connectPurpose,
      promotionalBudget,
    });

    await newInquiry.save();
    res.status(201).json({ message: 'Brand inquiry submitted successfully!', inquiry: newInquiry });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(500).json({ message: 'Server error. Failed to save inquiry.' });
  }
});

export default router;
