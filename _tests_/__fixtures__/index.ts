// Re-export all fixtures for easy importing
export * from "./api-responses";
export * from "./mock-data";
export * from "./test-utils";

// Convenience exports for common use cases
export {
  mockAuthResponses,
  mockProfileResponses,
  mockSupabaseResponses,
} from "./api-responses";
export {
  testUsers,
  testCredentials,
  mockFormData,
  mockErrorMessages,
} from "./mock-data";
export {
  renderWithProviders,
  createMockUseAuth,
  createMockAuthenticatedUser,
  testUtils,
} from "./test-utils";
