import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Post, Category, PostFilters } from '../types';
import ApiService from '../services/api';
import PostList from '../components/Posts/PostList';
import PostFilter from '../components/Posts/PostFilter';
import Pagination from '../components/Posts/Pagination';
import Breadcrumb from '../components/Common/Breadcrumb';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const Posts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<PostFilters>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as any) || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as any) || 'desc'
  });

  const fetchPosts = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await ApiService.getPosts(page, 12, filters);
      setPosts(response.data);
      setPagination(response.pagination);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchPosts(1);
    
    // Update URL search params
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
    
    setSearchParams(params);
  }, [filters]);

  const handleFiltersChange = (newFilters: PostFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handlePageChange = (page: number) => {
    fetchPosts(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const breadcrumbItems = [
    { label: 'Posts' }
  ];

  if (filters.category) {
    const category = categories.find(c => c.slug === filters.category);
    if (category) {
      breadcrumbItems.push({ label: category.name });
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {filters.category 
              ? `${categories.find(c => c.slug === filters.category)?.name || 'Category'} Posts`
              : 'All Posts'
            }
          </h1>
          <p className="text-gray-600">
            {pagination.total > 0 
              ? `Showing ${pagination.total} posts`
              : 'No posts found'
            }
          </p>
        </div>

        <PostFilter
          filters={filters}
          categories={categories}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
        />

        <PostList
          posts={posts}
          loading={loading}
          error={error}
          onRetry={() => fetchPosts(currentPage)}
          variant="grid"
        />

        {!loading && posts.length > 0 && (
          <div className="mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              hasNext={pagination.hasNext}
              hasPrev={pagination.hasPrev}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Posts;