// middleware/ownership.js
import Post from '../models/Post.js';

export const checkPostOwnership = async (req, res, next) => {
  try {
    const postId = req.params.id;
    
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format'
      });
    }
    
    const post = await Post.findById(postId);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is owner or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to modify this post'
      });
    }
    
    // Attach post to request for use in controller
    req.post = post;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};