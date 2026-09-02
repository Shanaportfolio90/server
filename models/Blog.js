import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      default: 'Brand Collab',
      trim: true,
    },
    summary: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      required: true, // Rich HTML content from Jodit Editor
    },
    coverImage: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      default: 'Snaha Chakraborty',
    },
    date: {
      type: String,
      default: '',
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    heroPosition: {
      type: String,
      enum: ['normal', 'main_hero', 'mini_1', 'mini_2', 'mini_3', 'spotlight'],
      default: 'normal',
    },
    videoUrl: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
