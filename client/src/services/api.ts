import { 
  User, 
  Category, 
  Post, 
  Comment, 
  ApiResponse, 
  PaginatedResponse, 
  PostFilters 
} from '../types';

const API_BASE_URL = '';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'An error occurred');
  }
  
  return data;
};

class ApiService {
  private static instance: ApiService;
  private currentUser: User | null = null;

  private constructor() {}

  static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Authentication
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await handleResponse(response);
    
    if (data.success) {
      this.currentUser = data.data.user;
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async register(userData: { username: string; email: string; password: string }): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await handleResponse(response);
    
    if (data.success) {
      this.currentUser = data.data.user;
      localStorage.setItem('token', data.data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.data.user));
    }
    
    return data;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  // Posts
  async getPosts(
    page: number = 1,
    limit: number = 10,
    filters: PostFilters = {}
  ): Promise<PaginatedResponse<Post>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== undefined && value !== '')
      )
    });

    const response = await fetch(`${API_BASE_URL}/posts?${params}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  async getPost(id: string): Promise<ApiResponse<Post>> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<Post>> {
    const response = await fetch(`${API_BASE_URL}/posts/slug/${slug}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  async createPost(postData: Partial<Post>): Promise<ApiResponse<Post>> {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    return handleResponse(response);
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<ApiResponse<Post>> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    return handleResponse(response);
  }

  async deletePost(id: string): Promise<ApiResponse<boolean>> {
    const response = await fetch(`${API_BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  // Categories
  async getCategories(): Promise<ApiResponse<Category[]>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  async createCategory(categoryData: Partial<Category>): Promise<ApiResponse<Category>> {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData)
    });

    return handleResponse(response);
  }

  // Comments
  async getComments(postId: string): Promise<ApiResponse<Comment[]>> {
    const response = await fetch(`${API_BASE_URL}/comments/post/${postId}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(response);
  }

  async createComment(commentData: {
    content: string;
    post_id: string;
    parent_id?: string;
  }): Promise<ApiResponse<Comment>> {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(commentData)
    });

    return handleResponse(response);
  }

  // File upload simulation
  async uploadImage(file: File): Promise<ApiResponse<string>> {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return a mock URL
    const mockUrl = `https://images.pexels.com/photos/${Math.floor(Math.random() * 1000000)}/pexels-photo-${Math.floor(Math.random() * 1000000)}.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1`;
    
    return {
      data: mockUrl,
      message: 'Image uploaded successfully',
      success: true
    };
  }
}

export default ApiService.getInstance();