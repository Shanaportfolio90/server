import mongoose from 'mongoose';

const collabCardSchema = new mongoose.Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    websiteUrl: {
      type: String,
      default: '#',
    },
    displayUrl: {
      type: String,
      default: '',
    },
    ctaButtonText: {
      type: String,
      default: '',
    },
    hasActionCta: {
      type: Boolean,
      default: false,
    },
    actionCtaTitle: {
      type: String,
      default: '',
    },
    actionCtaSubtitle: {
      type: String,
      default: '',
    },
    actionCtaBtnText: {
      type: String,
      default: '',
    },
    actionCtaLink: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CollabCard = mongoose.model('CollabCard', collabCardSchema);

export default CollabCard;
