import express from 'express';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import MediaContent from '../models/MediaContent.js';
import Inquiry from '../models/Inquiry.js';
import Contact from '../models/Contact.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'Snaha_Secret_Key_2026';

// Admin Login Route
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const validEmail = process.env.ADMIN_EMAIL || 'connect.snaha@gmail.com';
  const validPassword = process.env.ADMIN_PASSWORD || 'Snaha@00';

  if (email === validEmail && password === validPassword) {
    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.status(200).json({
      message: 'Admin login successful!',
      token,
      admin: { email, role: 'admin' },
    });
  } else {
    return res.status(401).json({ message: 'Invalid admin email or password.' });
  }
});

// Cloudinary Media Upload API
router.post('/upload', verifyAdmin, async (req, res) => {
  try {
    const { image } = req.body; // Base64 data string
    if (!image) {
      return res.status(400).json({ message: 'No image provided for upload.' });
    }

    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'snaha_portfolio_media',
    });

    res.status(200).json({
      message: 'Image uploaded successfully to Cloudinary!',
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Failed to upload image to Cloudinary.' });
  }
});

// Add New Media / Video Content Card
router.post('/media', verifyAdmin, async (req, res) => {
  try {
    const { title, category, videoUrl, description, thumbnailUrl, author, date } = req.body;

    if (!title || !category || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: 'Please provide title, category, video URL, and thumbnail.' });
    }

    const newMedia = new MediaContent({
      title,
      category,
      videoUrl,
      description: description || '',
      thumbnailUrl,
      author: author || 'Snaha Chakraborty',
      date: date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    });

    await newMedia.save();
    res.status(201).json({ message: 'Media content published successfully!', media: newMedia });
  } catch (error) {
    console.error('Error saving media:', error);
    res.status(500).json({ message: 'Failed to create media content.' });
  }
});

// Update Existing Media Content Card
router.put('/media/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, category, videoUrl, description, thumbnailUrl, author, date } = req.body;

    if (!title || !category || !videoUrl || !thumbnailUrl) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    const updatedMedia = await MediaContent.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        videoUrl,
        description: description || '',
        thumbnailUrl,
        author: author || 'Snaha Chakraborty',
        date: date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      },
      { new: true }
    );

    if (!updatedMedia) {
      return res.status(404).json({ message: 'Media content item not found.' });
    }

    res.status(200).json({ message: 'Media content updated successfully!', media: updatedMedia });
  } catch (error) {
    console.error('Error updating media:', error);
    res.status(500).json({ message: 'Failed to update media content.' });
  }
});

// Delete Media Content Item
router.delete('/media/:id', verifyAdmin, async (req, res) => {
  try {
    await MediaContent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Media item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete media item.' });
  }
});

// Get All Brand Collaboration Proposals
router.get('/inquiries', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
});

// Update Proposal Status
router.patch('/inquiries/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.status(200).json(updatedInquiry);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update status.' });
  }
});

// Delete Proposal
router.delete('/inquiries/:id', verifyAdmin, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
});

// Get All Contact Form Messages
router.get('/contacts', verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact messages.' });
  }
});

// Delete Contact Message
router.delete('/contacts/:id', verifyAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact message.' });
  }
});

export default router;
