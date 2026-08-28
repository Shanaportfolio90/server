import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    interest: { type: String, required: true },
    budget: { type: String, required: true },
    country: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'Replied'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Contact', contactSchema);
