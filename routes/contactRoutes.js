import express from 'express';
import Contact from '../models/Contact.js';

const router = express.Router();

// Submit General Contact Form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, interest, budget, country, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please fill in required fields.' });
    }

    const newContact = new Contact({
      name,
      email,
      phone,
      interest,
      budget,
      country,
      message,
    });

    await newContact.save();
    res.status(201).json({ message: 'Contact message submitted successfully!', contact: newContact });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ message: 'Server error. Failed to save contact message.' });
  }
});

export default router;
