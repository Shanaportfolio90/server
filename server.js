import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import mediaRoutes from './routes/mediaRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import collabRoutes from './routes/collabRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'c5d1k8xy',
  api_key: process.env.CLOUDINARY_API_KEY || '393788961743188',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'LBCu_ezcPAdWQc2kFHwS5dL6iYE',
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Database connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Route Handlers
app.use('/api/media', mediaRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/collabs', collabRoutes);
app.use('/api/admin/collabs', collabRoutes);
app.use('/api/admin', adminRoutes);

// Root Route
app.get('/', (req, res) => {
  res.send('Snaha Chakraborty Portfolio API Server Running with Cloudinary');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
