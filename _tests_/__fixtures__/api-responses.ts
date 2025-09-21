import type { User, Session } from "@supabase/supabase-js";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
}

// Mock API responses for authentication
export const mockAuthResponses = {
  success: {
    user: {
      id: "123e4567-e89b-12d3-a456-426614174000",
      aud: "authenticated",
      email: "test@example.com",
      email_confirmed_at: "2024-01-01T00:00:00Z",
      phone: "",
      confirmed_at: "2024-01-01T00:00:00Z",
      last_sign_in_at: "2024-01-01T00:00:00Z",
      app_metadata: {},
      user_metadata: {},
      identities: [],
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
      is_anonymous: false,
    } as User,
    session: {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_in: 3600,
      expires_at: 1704067200,
      token_type: "bearer",
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        aud: "authenticated",
        email: "test@example.com",
        email_confirmed_at: "2024-01-01T00:00:00Z",
        phone: "",
        confirmed_at: "2024-01-01T00:00:00Z",
        last_sign_in_at: "2024-01-01T00:00:00Z",
        app_metadata: {},
        user_metadata: {},
        identities: [],
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        is_anonymous: false,
      },
    } as Session,
  },
  error: {
    invalidCredentials: {
      message: "Invalid login credentials",
      status: 400,
    },
    emailNotConfirmed: {
      message: "Email not confirmed",
      status: 422,
    },
    tooManyRequests: {
      message: "Too many requests",
      status: 429,
    },
    serverError: {
      message: "Internal server error",
      status: 500,
    },
  },
};

// Mock profile responses
export const mockProfileResponses = {
  success: {
    id: "123e4567-e89b-12d3-a456-426614174000",
    full_name: "Test User",
    email: "test@example.com",
    bio: "Test user bio",
    avatar_url: "https://example.com/avatar.jpg",
    role: "user",
    status: "active",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  } as Profile,
  notFound: null,
  error: {
    message: "Profile not found",
    status: 404,
  },
};

// Mock database responses
export const mockDatabaseResponses = {
  profiles: {
    select: {
      success: [mockProfileResponses.success],
      empty: [],
      error: {
        message: "Database connection error",
        code: "PGRST116",
      },
    },
    insert: {
      success: mockProfileResponses.success,
      error: {
        message: "Duplicate key error",
        code: "23505",
      },
    },
    update: {
      success: { ...mockProfileResponses.success, full_name: "Updated Name" },
      error: {
        message: "Row not found",
        code: "PGRST116",
      },
    },
    delete: {
      success: {},
      error: {
        message: "Row not found",
        code: "PGRST116",
      },
    },
  },
};

// Mock API endpoints responses
export const mockApiResponses = {
  "/api/auth/login": {
    success: {
      status: 200,
      data: mockAuthResponses.success,
    },
    error: {
      status: 401,
      data: mockAuthResponses.error.invalidCredentials,
    },
  },
  "/api/auth/logout": {
    success: {
      status: 200,
      data: { message: "Logged out successfully" },
    },
  },
  "/api/profile": {
    success: {
      status: 200,
      data: mockProfileResponses.success,
    },
    notFound: {
      status: 404,
      data: mockProfileResponses.error,
    },
  },
};

// Mock Supabase client responses
export const mockSupabaseResponses = {
  auth: {
    getSession: {
      success: {
        data: { session: mockAuthResponses.success.session },
        error: null,
      },
      noSession: { data: { session: null }, error: null },
      error: { data: { session: null }, error: { message: "Session error" } },
    },
    signInWithPassword: {
      success: { data: mockAuthResponses.success, error: null },
      error: { data: null, error: mockAuthResponses.error.invalidCredentials },
    },
    signUp: {
      success: { data: mockAuthResponses.success, error: null },
      error: { data: null, error: { message: "User already exists" } },
    },
    signOut: {
      success: { error: null },
      error: { error: { message: "Logout error" } },
    },
    onAuthStateChange: {
      success: {
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      },
    },
  },
  from: {
    select: {
      success: {
        data: [mockProfileResponses.success],
        error: null,
      },
      error: {
        data: null,
        error: mockDatabaseResponses.profiles.select.error,
      },
    },
  },
};
