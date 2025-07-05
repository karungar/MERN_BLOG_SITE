import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: String
}, {
  timestamps: true // Auto-generates createdAt and updatedAt
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);