import mongoose from 'mongoose';

const adSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    tagline: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '#',
    },
    badgeText: {
      type: String,
      default: 'Sponsored',
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Ad = mongoose.model('Ad', adSchema);
export default Ad;
