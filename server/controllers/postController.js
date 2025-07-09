import mongoose from 'mongoose';
import PostModel from '../models/Post.js';
import CommentModel from '../models/Comment.js';

// Authorization helper functions
const isAuthorizedForPost = (post, user) => {
  return (
    user.role === 'admin' || 
    post.author.toString() === user._id.toString()
  );
};

const isAuthorRole = (user) => {
  return ['admin', 'author'].includes(user.role);
};

// Controller functions with authorization
async function createPost(req, res) {
  try {
    // Authorization: Only authors/admins can create posts
    if (!isAuthorRole(req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. Only authors and admins can create posts'
      });
    }

    const post = new PostModel({
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      excerpt: req.body.excerpt,
      featured_image: req.body.featured_image,
      author: req.user._id,
      category: req.body.category,
      tags: req.body.tags || [],
      status: req.body.status || 'draft',
      view_count: req.body.view_count || 0,
      published_at: req.body.status === 'published' ? new Date() : null
    });

    await post.save();
    
    // Populate details
    const populated = await post.populate('author', 'username avatar role')
                               .populate('category', 'name slug');
    
    res.status(201).json({
      success: true,
      data: populated
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getPosts(req, res) {
  try {
    // Extract filters from query parameters
    const { status, category, author, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    // Build query
    let query = PostModel.find()
      .populate('author', 'username avatar role')
      .populate('category', 'name slug');
    
    // Apply filters
    if (status) query = query.where('status').equals(status);
    if (category) query = query.where('category.slug').equals(category);
    if (author) query = query.where('author.username').equals(author);
    if (search) {
      query = query.or([
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: search }
      ]);
    }
    
    // Apply sorting and pagination
    query = query.sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
                .skip(offset)
                .limit(limit);
    
    const posts = await query.exec();
    
    // Get comment counts for each post
    const postsWithComments = await Promise.all(posts.map(async post => {
      const commentCount = await CommentModel.countDocuments({ post: post._id });
      return { ...post.toObject(), commentCount };
    }));
    
    // Get total count for pagination
    const total = await PostModel.countDocuments(query.getFilter());
    
    res.json({
      success: true,
      data: postsWithComments,
      pagination: {
        total,
        limit,
        offset
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getPostById(req, res) {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    const post = await PostModel.findById(req.params.id)
      .populate('author', 'username avatar role')
      .populate('category', 'name slug');
      
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get comment count
    const commentCount = await CommentModel.countDocuments({ post: post._id });
    
    res.json({
      success: true,
      data: { ...post.toObject(), commentCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getPostBySlug(req, res) {
  try {
    const post = await PostModel.findOne({ slug: req.params.slug })
      .populate('author', 'username avatar role')
      .populate('category', 'name slug');
      
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Get comment count
    const commentCount = await CommentModel.countDocuments({ post: post._id });
    
    res.json({
      success: true,
      data: { ...post.toObject(), commentCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function updatePost(req, res) {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    // Get post first for authorization check
    const existingPost = await PostModel.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Authorization: Only author or admin can update
    if (!isAuthorizedForPost(existingPost, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only update your own posts'
      });
    }

    const updateData = { ...req.body };
    
    // Handle published_at
    if (updateData.status === 'published' && !existingPost.published_at) {
      updateData.published_at = new Date();
    }
    
    const updatedPost = await PostModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('author', 'username avatar role')
    .populate('category', 'name slug');
    
    // Get comment count
    const commentCount = await CommentModel.countDocuments({ post: updatedPost._id });
    
    res.json({
      success: true,
      data: { ...updatedPost.toObject(), commentCount }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deletePost(req, res) {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    // Get post first for authorization check
    const existingPost = await PostModel.findById(req.params.id);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }

    // Authorization: Only author or admin can delete
    if (!isAuthorizedForPost(existingPost, req.user)) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only delete your own posts'
      });
    }

    // Delete associated comments
    await CommentModel.deleteMany({ post: req.params.id });
    
    // Delete the post
    await PostModel.findByIdAndDelete(req.params.id);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function incrementViewCount(req, res) {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    const post = await PostModel.findByIdAndUpdate(
      req.params.id,
      { $inc: { view_count: 1 } },
      { new: true }
    );
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export {
  createPost,
  getPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  incrementViewCount
};