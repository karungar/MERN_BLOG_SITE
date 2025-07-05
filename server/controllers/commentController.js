// controllers/commentController.js
import mongoose from 'mongoose';
import CommentModel from '../models/Comment.js';
import PostModel from '../models/Post.js';
import UserModel from '../models/User.js';

// Add these exports at the bottom
export {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment
};

async function createComment(req, res) {
  try {
    const comment = new CommentModel({
      content: req.body.content,
      author: req.user._id,
      post: req.body.post,
      parent: req.body.parent
    });
    
    await comment.save();
    
    // Populate author details
    const populated = await comment.populate('author', 'username avatar role');
    
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

async function getComments(req, res) {
  try {
    const comments = await CommentModel.find({ post: req.params.postId })
      .populate('author', 'username avatar role')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function getComment(req, res) {
  try {
    const comment = await CommentModel.findById(req.params.id)
      .populate('author', 'username avatar role');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function updateComment(req, res) {
  try {
    const comment = await CommentModel.findByIdAndUpdate(
      req.params.id,
      { content: req.body.content },
      { new: true }
    ).populate('author', 'username avatar role');
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    res.json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

async function deleteComment(req, res) {
  try {
    // Delete replies first
    await CommentModel.deleteMany({ parent: req.params.id });
    
    // Delete main comment
    await CommentModel.findByIdAndDelete(req.params.id);
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}