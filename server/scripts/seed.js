import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import database from '../config/database.js';

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await Comment.deleteMany();
    await Post.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    // Create users
    const users = [
      {
        username: 'johndoe',
        email: 'john@example.com',
        password: await bcrypt.hash('password123', 12),
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        role: 'admin'
      },
      {
        username: 'janedoe',
        email: 'jane@example.com',
        password: await bcrypt.hash('password123', 12),
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        role: 'user'
      },
      {
        username: 'alexsmith',
        email: 'alex@example.com',
        password: await bcrypt.hash('password123', 12),
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
        role: 'user'
      }
    ];

    const createdUsers = await User.insertMany(users);

    // Create categories
    const categories = [
      {
        name: 'Technology',
        slug: 'technology',
        description: 'Latest tech trends and innovations'
      },
      {
        name: 'Design',
        slug: 'design',
        description: 'UI/UX design principles and inspiration'
      },
      {
        name: 'Development',
        slug: 'development',
        description: 'Programming tutorials and best practices'
      },
      {
        name: 'Business',
        slug: 'business',
        description: 'Entrepreneurship and business strategies'
      }
    ];

    const createdCategories = await Category.insertMany(categories);

    // Create posts
    const posts = [
      {
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: 'future-web-development-2024',
        content: `<p>Web development continues to evolve at a rapid pace...</p>`,
        excerpt: 'Explore the key trends that will shape web development in 2024...',
        featured_image: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        author: createdUsers[0]._id,
        category: createdCategories[0]._id,
        tags: ['web development', 'trends', 'technology', 'future'],
        status: 'published',
        view_count: 1247,
        published_at: new Date('2024-01-15')
      },
      {
        title: 'Mastering Modern CSS: Grid, Flexbox, and Beyond',
        slug: 'mastering-modern-css-grid-flexbox',
        content: `<p>CSS has evolved tremendously over the past few years...</p>`,
        excerpt: 'Learn how to use CSS Grid and Flexbox effectively...',
        featured_image: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        author: createdUsers[1]._id,
        category: createdCategories[1]._id,
        tags: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
        status: 'published',
        view_count: 892,
        published_at: new Date('2024-01-10')
      },
      {
        title: 'Building Scalable React Applications: Best Practices',
        slug: 'building-scalable-react-applications',
        content: `<p>As React applications grow in complexity...</p>`,
        excerpt: 'Essential best practices for building maintainable...',
        featured_image: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
        author: createdUsers[2]._id,
        category: createdCategories[2]._id,
        tags: ['react', 'javascript', 'architecture', 'best practices'],
        status: 'published',
        view_count: 1456,
        published_at: new Date('2024-01-08')
      }
    ];

    await Post.insertMany(posts);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Demo user credentials:');
    console.log('   Email: john@example.com');
    console.log('   Password: password123');
    
    // Close connection after seeding
    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

// Wait for database connection before seeding
database.connect().then(() => {
  seedData();
});