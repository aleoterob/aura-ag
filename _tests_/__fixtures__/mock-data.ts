import type { User, Session } from '@supabase/supabase-js'
import type { Profile } from './api-responses'

// Test user data
export const testUsers = {
  admin: {
    id: 'admin-123',
    email: 'admin@example.com',
    full_name: 'Admin User',
    role: 'admin',
    status: 'active',
  },
  user: {
    id: 'user-123',
    email: 'user@example.com',
    full_name: 'Regular User',
    role: 'user',
    status: 'active',
  },
  inactive: {
    id: 'inactive-123',
    email: 'inactive@example.com',
    full_name: 'Inactive User',
    role: 'user',
    status: 'inactive',
  },
  pending: {
    id: 'pending-123',
    email: 'pending@example.com',
    full_name: 'Pending User',
    role: 'user',
    status: 'pending',
  },
}

// Test credentials
export const testCredentials = {
  valid: {
    email: 'test@example.com',
    password: 'password123',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
  },
  weak: {
    email: 'test@example.com',
    password: '123',
  },
  empty: {
    email: '',
    password: '',
  },
  malformed: {
    email: 'not-an-email',
    password: 'password123',
  },
}

// Mock form data
export const mockFormData = {
  login: {
    valid: {
      email: 'user@example.com',
      password: 'securePassword123',
    },
    invalid: {
      email: 'invalid-email',
      password: '',
    },
  },
  register: {
    valid: {
      email: 'newuser@example.com',
      password: 'securePassword123',
      confirmPassword: 'securePassword123',
      fullName: 'New User',
    },
    invalid: {
      email: 'invalid-email',
      password: '123',
      confirmPassword: '456',
      fullName: '',
    },
  },
  profile: {
    valid: {
      full_name: 'Updated Name',
      bio: 'Updated bio',
      avatar_url: 'https://example.com/new-avatar.jpg',
    },
    invalid: {
      full_name: '',
      bio: 'x'.repeat(1000), // Too long
      avatar_url: 'not-a-url',
    },
  },
}

// Mock component props
export const mockComponentProps = {
  button: {
    default: {
      children: 'Click me',
    },
    loading: {
      children: 'Loading...',
      disabled: true,
    },
    destructive: {
      children: 'Delete',
      variant: 'destructive' as const,
    },
    withIcon: {
      children: 'Save',
      variant: 'outline' as const,
      size: 'lg' as const,
    },
  },
  input: {
    email: {
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
    },
    password: {
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
    },
    text: {
      type: 'text',
      placeholder: 'Enter text',
    },
  },
  card: {
    default: {
      title: 'Card Title',
      description: 'Card description',
      children: 'Card content',
    },
  },
}

// Mock navigation data
export const mockNavigation = {
  routes: [
    { path: '/', name: 'Home', protected: false },
    { path: '/login', name: 'Login', protected: false },
    { path: '/register', name: 'Register', protected: false },
    { path: '/dashboard', name: 'Dashboard', protected: true },
    { path: '/profile', name: 'Profile', protected: true },
    { path: '/settings', name: 'Settings', protected: true },
  ],
  breadcrumbs: {
    dashboard: [
      { name: 'Home', href: '/' },
      { name: 'Dashboard', href: '/dashboard' },
    ],
    profile: [
      { name: 'Home', href: '/' },
      { name: 'Profile', href: '/profile' },
    ],
    settings: [
      { name: 'Home', href: '/' },
      { name: 'Settings', href: '/settings' },
    ],
  },
}

// Mock theme data
export const mockThemeData = {
  light: {
    name: 'light',
    colors: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      foreground: '#000000',
    },
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#ffffff',
      secondary: '#999999',
      background: '#000000',
      foreground: '#ffffff',
    },
  },
}

// Mock error messages
export const mockErrorMessages = {
  auth: {
    invalidCredentials: 'Invalid email or password',
    emailNotConfirmed: 'Please confirm your email address',
    userNotFound: 'User not found',
    tooManyRequests: 'Too many login attempts. Please try again later',
    networkError: 'Network error. Please check your connection',
  },
  validation: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    password: 'Password must be at least 8 characters',
    passwordMatch: 'Passwords do not match',
    minLength: 'Must be at least {min} characters',
    maxLength: 'Must be no more than {max} characters',
  },
  general: {
    serverError: 'Something went wrong. Please try again',
    notFound: 'The requested resource was not found',
    unauthorized: 'You are not authorized to access this resource',
    forbidden: 'Access denied',
  },
}

// Mock loading states
export const mockLoadingStates = {
  idle: false,
  loading: true,
  success: false,
  error: false,
}

// Mock pagination data
export const mockPagination = {
  page1: {
    page: 1,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrev: false,
  },
  middlePage: {
    page: 5,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: true,
    hasPrev: true,
  },
  lastPage: {
    page: 10,
    limit: 10,
    total: 100,
    totalPages: 10,
    hasNext: false,
    hasPrev: true,
  },
}

// Mock search data
export const mockSearchData = {
  users: {
    query: 'john',
    results: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Johnny Smith', email: 'johnny@example.com' },
    ],
  },
  posts: {
    query: 'react',
    results: [
      { id: '1', title: 'React Best Practices', content: '...' },
      { id: '2', title: 'React Hooks Guide', content: '...' },
    ],
  },
}

// Mock file upload data
export const mockFileUpload = {
  image: {
    name: 'avatar.jpg',
    type: 'image/jpeg',
    size: 1024000, // 1MB
    lastModified: Date.now(),
  },
  document: {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 2048000, // 2MB
    lastModified: Date.now(),
  },
  invalid: {
    name: 'script.exe',
    type: 'application/x-executable',
    size: 5120000, // 5MB
    lastModified: Date.now(),
  },
}
