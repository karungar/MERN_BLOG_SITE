import { User, Category, Post, Comment } from '../types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    role: 'admin',
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    username: 'janedoe',
    email: 'jane@example.com',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    role: 'user',
    createdAt: new Date('2023-02-01')
  },
  {
    id: '3',
    username: 'alexsmith',
    email: 'alex@example.com',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
    role: 'user',
    createdAt: new Date('2023-03-01')
  }
];

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends and innovations',
    postCount: 8,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    name: 'Design',
    slug: 'design',
    description: 'UI/UX design principles and inspiration',
    postCount: 6,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '3',
    name: 'Development',
    slug: 'development',
    description: 'Programming tutorials and best practices',
    postCount: 12,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '4',
    name: 'Business',
    slug: 'business',
    description: 'Entrepreneurship and business strategies',
    postCount: 5,
    createdAt: new Date('2023-01-01')
  }
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'The Future of Web Development: Trends to Watch in 2024',
    slug: 'future-web-development-2024',
    content: `
      <p>Web development continues to evolve at a rapid pace, with new technologies and frameworks emerging constantly. In this comprehensive guide, we'll explore the key trends that will shape the future of web development in 2024 and beyond.</p>
      
      <h2>1. Server-Side Rendering Renaissance</h2>
      <p>Server-side rendering (SSR) is making a comeback with modern frameworks like Next.js, Nuxt.js, and SvelteKit leading the charge. These frameworks offer the best of both worlds: fast initial page loads and rich interactivity.</p>
      
      <h2>2. Web Assembly (WASM) Integration</h2>
      <p>Web Assembly is becoming more mainstream, allowing developers to run high-performance code written in languages like Rust and C++ directly in the browser. This opens up new possibilities for web applications.</p>
      
      <h2>3. Progressive Enhancement</h2>
      <p>The concept of progressive enhancement is gaining traction again, with developers focusing on building resilient web applications that work across all devices and network conditions.</p>
      
      <h2>4. AI-Powered Development Tools</h2>
      <p>AI is revolutionizing how we write code, with tools like GitHub Copilot and ChatGPT helping developers write better code faster. These tools are becoming essential parts of the development workflow.</p>
      
      <p>The future of web development is bright, with exciting technologies and methodologies emerging to help us build better, faster, and more accessible web applications.</p>
    `,
    excerpt: 'Explore the key trends that will shape web development in 2024, from server-side rendering to AI-powered development tools.',
    featuredImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[0],
    category: mockCategories[0],
    tags: ['web development', 'trends', 'technology', 'future'],
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    viewCount: 1247,
    commentCount: 23
  },
  {
    id: '2',
    title: 'Mastering Modern CSS: Grid, Flexbox, and Beyond',
    slug: 'mastering-modern-css-grid-flexbox',
    content: `
      <p>CSS has evolved tremendously over the past few years, introducing powerful layout systems like CSS Grid and Flexbox that have revolutionized how we build responsive websites.</p>
      
      <h2>CSS Grid: The Ultimate Layout System</h2>
      <p>CSS Grid provides a two-dimensional layout system that allows you to create complex layouts with ease. Unlike Flexbox, which is primarily one-dimensional, Grid excels at creating both row and column layouts simultaneously.</p>
      
      <h2>Flexbox: Perfect for Component Layouts</h2>
      <p>Flexbox is ideal for component-level layouts and alignment. It's perfect for centering content, distributing space, and creating responsive navigation bars.</p>
      
      <h2>Modern CSS Features</h2>
      <p>Beyond Grid and Flexbox, modern CSS includes features like custom properties (CSS variables), container queries, and advanced selectors that make styling more efficient and maintainable.</p>
    `,
    excerpt: 'Learn how to use CSS Grid and Flexbox effectively to create modern, responsive layouts.',
    featuredImage: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[1],
    category: mockCategories[1],
    tags: ['css', 'grid', 'flexbox', 'layout', 'responsive'],
    status: 'published',
    publishedAt: new Date('2024-01-10'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    viewCount: 892,
    commentCount: 15
  },
  {
    id: '3',
    title: 'Building Scalable React Applications: Best Practices',
    slug: 'building-scalable-react-applications',
    content: `
      <p>As React applications grow in complexity, maintaining code quality and scalability becomes increasingly important. This guide covers essential best practices for building large-scale React applications.</p>
      
      <h2>Component Architecture</h2>
      <p>Organizing your components in a logical hierarchy is crucial for maintainability. Use composition over inheritance and keep components focused on a single responsibility.</p>
      
      <h2>State Management</h2>
      <p>Choose the right state management solution for your application. While React's built-in state is perfect for simple cases, complex applications might benefit from Redux, Zustand, or Jotai.</p>
      
      <h2>Performance Optimization</h2>
      <p>Implement React.memo, useMemo, and useCallback judiciously to prevent unnecessary re-renders. Use React DevTools Profiler to identify performance bottlenecks.</p>
    `,
    excerpt: 'Essential best practices for building maintainable and scalable React applications.',
    featuredImage: 'https://images.pexels.com/photos/11035540/pexels-photo-11035540.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[2],
    category: mockCategories[2],
    tags: ['react', 'javascript', 'architecture', 'best practices'],
    status: 'published',
    publishedAt: new Date('2024-01-08'),
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    viewCount: 1456,
    commentCount: 31
  },
  {
    id: '4',
    title: 'The Art of User Experience Design',
    slug: 'art-of-user-experience-design',
    content: `
      <p>User Experience (UX) design is both an art and a science. It requires creativity, empathy, and analytical thinking to create products that users love and find valuable.</p>
      
      <h2>Understanding Your Users</h2>
      <p>Great UX starts with understanding your users' needs, goals, and pain points. Conduct user research, create personas, and map user journeys to gain deep insights.</p>
      
      <h2>Design Principles</h2>
      <p>Follow established design principles like consistency, feedback, and affordance. These principles help create intuitive and predictable user experiences.</p>
      
      <h2>Testing and Iteration</h2>
      <p>UX design is an iterative process. Prototype early, test often, and be prepared to iterate based on user feedback and data.</p>
    `,
    excerpt: 'Discover the principles and practices that make great user experiences.',
    featuredImage: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[1],
    category: mockCategories[1],
    tags: ['ux', 'design', 'user research', 'prototyping'],
    status: 'published',
    publishedAt: new Date('2024-01-05'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    viewCount: 743,
    commentCount: 18
  },
  {
    id: '5',
    title: 'Entrepreneurship in the Digital Age',
    slug: 'entrepreneurship-digital-age',
    content: `
      <p>The digital revolution has democratized entrepreneurship, making it easier than ever to start and scale a business. This guide explores the opportunities and challenges of digital entrepreneurship.</p>
      
      <h2>Digital Business Models</h2>
      <p>From SaaS to e-commerce, digital business models offer unique advantages including scalability, lower overhead costs, and global reach from day one.</p>
      
      <h2>Building Your Online Presence</h2>
      <p>A strong online presence is crucial for digital entrepreneurs. This includes having a professional website, active social media profiles, and a content marketing strategy.</p>
      
      <h2>Funding Your Digital Venture</h2>
      <p>Explore various funding options including bootstrapping, angel investors, venture capital, and crowdfunding platforms to fuel your digital business growth.</p>
    `,
    excerpt: 'Navigate the opportunities and challenges of starting a business in the digital age.',
    featuredImage: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[0],
    category: mockCategories[3],
    tags: ['entrepreneurship', 'digital business', 'startup', 'strategy'],
    status: 'published',
    publishedAt: new Date('2024-01-03'),
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    viewCount: 567,
    commentCount: 12
  },
  {
    id: '6',
    title: 'Draft: Advanced TypeScript Patterns',
    slug: 'advanced-typescript-patterns',
    content: `
      <p>This is a draft post about advanced TypeScript patterns including utility types, conditional types, and template literal types.</p>
      
      <h2>Utility Types</h2>
      <p>TypeScript provides several utility types that help with common type transformations...</p>
    `,
    excerpt: 'Explore advanced TypeScript patterns for better type safety and developer experience.',
    featuredImage: 'https://images.pexels.com/photos/11035669/pexels-photo-11035669.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1',
    author: mockUsers[2],
    category: mockCategories[2],
    tags: ['typescript', 'patterns', 'advanced'],
    status: 'draft',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-01-16'),
    viewCount: 0,
    commentCount: 0
  }
];

// Mock Comments
export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! I particularly enjoyed the section on Server-Side Rendering. Do you have any recommendations for getting started with Next.js?',
    author: mockUsers[1],
    post: mockPosts[0],
    replies: [
      {
        id: '2',
        content: 'Thanks for the feedback! I recommend starting with the official Next.js tutorial - it\'s comprehensive and well-structured.',
        author: mockUsers[0],
        post: mockPosts[0],
        parentId: '1',
        replies: [],
        createdAt: new Date('2024-01-16T10:30:00Z'),
        updatedAt: new Date('2024-01-16T10:30:00Z')
      }
    ],
    createdAt: new Date('2024-01-16T09:15:00Z'),
    updatedAt: new Date('2024-01-16T09:15:00Z')
  },
  {
    id: '3',
    content: 'The CSS Grid section was really helpful. I\'ve been struggling with complex layouts, and this gave me some great ideas.',
    author: mockUsers[2],
    post: mockPosts[1],
    replies: [],
    createdAt: new Date('2024-01-11T14:20:00Z'),
    updatedAt: new Date('2024-01-11T14:20:00Z')
  }
];