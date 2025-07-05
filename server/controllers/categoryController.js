// controllers/categoryController.js
import mongoose from 'mongoose';
import CategoryModel from '../models/Category.js';
import PostModel from '../models/Post.js';

// Add these exports at the bottom
export {
  createCategory,
  getCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory
};

async function createCategory(req, res) {
  // ... existing implementation ...
}

async function getCategories(req, res) {
  // ... existing implementation ...
}

async function getCategory(req, res) {
  // ... existing implementation ...
}

async function getCategoryBySlug(req, res) {
  // ... existing implementation ...
}

async function updateCategory(req, res) {
  // ... existing implementation ...
}

async function deleteCategory(req, res) {
  // ... existing implementation ...
}