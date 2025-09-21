import React from "react";
import { render, RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import "@testing-library/jest-dom";
import { mockSupabaseResponses } from "./api-responses";
import { testUsers } from "./mock-data";

// Mock Next.js router
export const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

// Mock useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
}));

// Mock Supabase client
jest.mock("@/lib/supabase/client", () => ({
  supabase: mockSupabaseResponses,
}));

// Mock useAuth hook
export const createMockUseAuth = (overrides = {}) => {
  return jest.fn().mockReturnValue({
    user: null,
    profile: null,
    session: null,
    loading: false,
    signIn: jest.fn().mockResolvedValue({}),
    signUp: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({}),
    isAuthenticated: false,
    ...overrides,
  });
};

// Mock authenticated user
export const createMockAuthenticatedUser = (
  userType: keyof typeof testUsers = "user"
) => {
  const user = testUsers[userType];
  return {
    user: {
      id: user.id,
      email: user.email,
    },
    profile: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    },
    session: {
      access_token: "mock-token",
      user: {
        id: user.id,
        email: user.email,
      },
    },
    loading: false,
    isAuthenticated: true,
    signIn: jest.fn().mockResolvedValue({}),
    signUp: jest.fn().mockResolvedValue({}),
    signOut: jest.fn().mockResolvedValue({}),
  };
};

// Create test query client
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  queryClient?: QueryClient;
  theme?: "light" | "dark" | "system";
  initialEntries?: string[];
}

export const renderWithProviders = (
  ui: React.ReactElement,
  {
    queryClient = createTestQueryClient(),
    theme = "light",
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={false}
      >
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  };
};

// Utility functions for common test scenarios
export const testUtils = {
  // Create user event instance
  createUser: () => userEvent.setup(),

  // Wait for async operations
  waitFor: async (callback: () => void | Promise<void>, timeout = 1000) => {
    const { waitFor } = await import("@testing-library/react");
    return waitFor(callback, { timeout });
  },

  // Mock successful API response
  mockApiSuccess: (data: unknown) => ({
    data,
    error: null,
  }),

  // Mock API error response
  mockApiError: (message: string, code?: string) => ({
    data: null,
    error: { message, code },
  }),

  // Create mock form data
  createFormData: (data: Record<string, string>) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });
    return formData;
  },

  // Mock localStorage
  mockLocalStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },

  // Mock sessionStorage
  mockSessionStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },

  // Mock fetch
  mockFetch: (response: unknown, ok = true, status = 200) => {
    return jest.fn().mockResolvedValue({
      ok,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    });
  },

  // Mock window.location
  mockLocation: (url: string) => {
    Object.defineProperty(window, "location", {
      value: {
        href: url,
        origin: "http://localhost:3000",
        pathname: new URL(url).pathname,
        search: new URL(url).search,
        hash: new URL(url).hash,
        assign: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
      },
      writable: true,
    });
  },

  // Mock IntersectionObserver
  mockIntersectionObserver: () => {
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;
  },

  // Mock ResizeObserver
  mockResizeObserver: () => {
    const mockResizeObserver = jest.fn();
    mockResizeObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.ResizeObserver = mockResizeObserver;
  },
};

// Custom matchers are now available globally after importing @testing-library/jest-dom

// Setup function for common test setup
export const setupTest = () => {
  // Clear all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockRouter.push.mockClear();
    mockRouter.back.mockClear();
    mockRouter.forward.mockClear();
    mockRouter.refresh.mockClear();
    mockRouter.replace.mockClear();
    mockRouter.prefetch.mockClear();
  });

  // Cleanup after each test
  afterEach(() => {
    jest.resetAllMocks();
  });
};

// Export everything as default for convenience
const testUtilsExports = {
  mockRouter,
  createMockUseAuth,
  createMockAuthenticatedUser,
  createTestQueryClient,
  renderWithProviders,
  testUtils,
  setupTest,
};

export default testUtilsExports;
