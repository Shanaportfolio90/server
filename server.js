import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';

import Inquiry from './models/Inquiry.js';
import Contact from './models/Contact.js';
import MediaContent from './models/MediaContent.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'Snaha_Secret_Key_2026';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'c5d1k8xy',
  api_key: process.env.CLOUDINARY_API_KEY || '393788961743188',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LBCu_ezcPAdWQc2kFHwS5dL6iYE',
});

// Middleware (Increased limit to handle base64 image uploads for Cloudinary)
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Database connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Auth Middleware for Admin Routes
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// ==========================================================================
// PUBLIC ROUTES
// ==========================================================================

// Get All Published Media / Video Content for Portfolio Section
app.get('/api/media', async (req, res) => {
  try {
    const mediaList = await MediaContent.find().sort({ createdAt: -1 });
    res.status(200).json(mediaList);
  } catch (error) {
    console.error('Error fetching media content:', error);
    res.status(500).json({ message: 'Failed to fetch media content.' });
  }
});

// Submit Brand Collaboration Inquiry Form
app.post('/api/inquiries', async (req, res) => {
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

// Submit General Contact Form
app.post('/api/contact', async (req, res) => {
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

// Admin Login Route (Email: connect.snaha@gmail.com & Password: Snaha@00)
app.post('/api/admin/login', (req, res) => {
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

// ==========================================================================
// PROTECTED ADMIN ROUTES
// ==========================================================================

// Cloudinary Media Upload API
app.post('/api/admin/upload', verifyAdmin, async (req, res) => {
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
app.post('/api/admin/media', verifyAdmin, async (req, res) => {
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

// Update Existing Media / Video Content Card
app.put('/api/admin/media/:id', verifyAdmin, async (req, res) => {
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
app.delete('/api/admin/media/:id', verifyAdmin, async (req, res) => {
  try {
    await MediaContent.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Media item deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete media item.' });
  }
});

// Get All Brand Collaboration Proposals
app.get('/api/admin/inquiries', verifyAdmin, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch inquiries.' });
  }
});

// Update Proposal Status
app.patch('/api/admin/inquiries/:id/status', verifyAdmin, async (req, res) => {
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
app.delete('/api/admin/inquiries/:id', verifyAdmin, async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inquiry deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete inquiry.' });
  }
});

// Get All Contact Form Messages
app.get('/api/admin/contacts', verifyAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact messages.' });
  }
});

// Delete Contact Message
app.delete('/api/admin/contacts/:id', verifyAdmin, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Contact message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete contact message.' });
  }
});

// Root Route
app.get('/', (req, res) => {
  res.send('Snaha Chakraborty Portfolio API Server Running with Cloudinary');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
