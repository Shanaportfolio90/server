import mongoose from 'mongoose';

const mediaContentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    videoUrl: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, required: true },
    author: { type: String, default: 'Snaha Chakraborty' },
    date: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('MediaContent', mediaContentSchema);
