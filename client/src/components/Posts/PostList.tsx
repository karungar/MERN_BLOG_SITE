import React from 'react';
import { Post } from '../../types';
import PostCard from './PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorMessage from '../Common/ErrorMessage';

interface PostListProps {
  posts: Post[];
  loading?: boolean;
  error?: string;
  onRetry?: () => void;
  variant?: 'default' | 'grid' | 'compact';
}

const PostList: React.FC<PostListProps> = ({ 
  posts, 
  loading, 
  error, 
  onRetry,
  variant = 'default' 
}) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No posts found.</p>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <PostCard 
          key={post.id} 
          post={post} 
          variant={index === 0 ? 'featured' : 'default'}
        />
      ))}
    </div>
  );
};

export default PostList;