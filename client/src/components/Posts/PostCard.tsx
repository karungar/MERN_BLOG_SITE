import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Clock, MessageSquare, Eye, User } from 'lucide-react';
import { Post } from '../../types';

interface PostCardProps {
  post: Post;
  variant?: 'default' | 'featured' | 'compact';
}

const PostCard: React.FC<PostCardProps> = ({ post, variant = 'default' }) => {
  const formatDate = (date: Date) => format(date, 'MMM dd, yyyy');
  const readingTime = Math.ceil(post.content.length / 1000); // Rough estimate

  if (variant === 'featured') {
    return (
      <div className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="flex items-center space-x-4 mb-3">
            <span className="bg-blue-600 text-xs font-medium px-3 py-1 rounded-full">
              {post.category.name}
            </span>
            <span className="text-sm">{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <Link to={`/posts/${post.slug}`} className="block group">
            <h2 className="text-2xl font-bold mb-2 group-hover:text-blue-300 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-200 mb-3 line-clamp-2">{post.excerpt}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{post.viewCount}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{post.commentCount}</span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
        <div className="p-4">
          <div className="flex items-start space-x-3">
            {post.featuredImage && (
              <div className="flex-shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {post.category.name}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(post.publishedAt || post.createdAt)}
                </span>
              </div>
              <Link to={`/posts/${post.slug}`} className="block group">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{post.author.username}</span>
                  <div className="flex items-center space-x-3">
                    <span>{post.viewCount} views</span>
                    <span>{post.commentCount} comments</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
      {post.featuredImage && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-3">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {post.category.name}
          </span>
          <span className="text-sm text-gray-500">
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
        </div>
        <Link to={`/posts/${post.slug}`} className="block group">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
            {post.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} min read</span>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Eye className="h-4 w-4" />
                <span>{post.viewCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </div>
            </div>
          </div>
        </Link>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostCard;