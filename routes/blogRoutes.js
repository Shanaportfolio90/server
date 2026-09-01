import express from 'express';
import { verifyAdmin } from '../middlewares/authMiddleware.js';
import Blog from '../models/Blog.js';

const router = express.Router();

// Helper to generate URL-friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// GET /api/blogs - Get all published blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

// GET /api/blogs/:id - Get single blog post by ID or slug
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let blog;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json(blog);
  } catch (error) {
    console.error('Error fetching blog details:', error);
    res.status(500).json({ message: 'Failed to fetch blog post' });
  }
});

// POST /api/admin/blogs - Create a new dynamic blog post (Admin protected)
router.post('/', verifyAdmin, async (req, res) => {
  try {
    const { title, category, summary, content, coverImage, author, date, readTime, isFeatured } = req.body;

    if (!title || !category || !content || !coverImage) {
      return res.status(400).json({ message: 'Title, category, cover image, and content are required.' });
    }

    const generatedSlug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;
    const formattedDate = date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });

    const newBlog = new Blog({
      title,
      slug: generatedSlug,
      category,
      summary: summary || '',
      content,
      coverImage,
      author: author || 'Snaha Chakraborty',
      date: formattedDate,
      readTime: readTime || '4 min read',
      isFeatured: !!isFeatured,
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog post created successfully!', blog: newBlog });
  } catch (error) {
    console.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Failed to create blog post' });
  }
});

// PUT /api/admin/blogs/:id - Update existing blog post (Admin protected)
router.put('/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, category, summary, content, coverImage, author, date, readTime, isFeatured } = req.body;

    if (!title || !category || !content || !coverImage) {
      return res.status(400).json({ message: 'Title, category, cover image, and content are required.' });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        summary: summary || '',
        content,
        coverImage,
        author: author || 'Snaha Chakraborty',
        date: date || new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: readTime || '4 min read',
        isFeatured: !!isFeatured,
      },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.status(200).json({ message: 'Blog post updated successfully!', blog: updatedBlog });
  } catch (error) {
    console.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Failed to update blog post' });
  }
});

// DELETE /api/admin/blogs/:id - Delete blog post (Admin protected)
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    res.status(200).json({ message: 'Blog post deleted successfully!' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Failed to delete blog post' });
  }
});

export default router;
