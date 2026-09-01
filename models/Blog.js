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
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
