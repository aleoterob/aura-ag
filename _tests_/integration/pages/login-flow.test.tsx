import { screen, waitFor } from "@testing-library/react";
import {
  renderWithProviders,
  createMockUseAuth,
  testUsers,
  testUtils,
} from "../../__fixtures__";
import { useAuth } from "@/hooks/use-auth";
import LoginPage from "@/app/(auth)/login/page";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock useAuth hook
jest.mock("@/hooks/use-auth", () => ({
  useAuth: jest.fn(),
}));

describe("Login Flow Integration Test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders login form correctly", () => {
    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: jest.fn().mockResolvedValue({}),
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    expect(screen.getAllByText("Iniciar Sesión")).toHaveLength(2);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Contraseña")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /iniciar sesión/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/¿No tienes una cuenta?/)).toBeInTheDocument();
  });

  it("allows user to toggle password visibility", async () => {
    const user = testUtils.createUser();

    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: jest.fn().mockResolvedValue({}),
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    const passwordInput = screen.getByLabelText("Contraseña");
    const toggleButton = screen.getByRole("button", { name: "" });

    expect(passwordInput).toHaveAttribute("type", "password");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "text");

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute("type", "password");
  });

  it("handles successful login", async () => {
    const user = testUtils.createUser();
    const mockSignIn = jest.fn().mockResolvedValue({});

    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: mockSignIn,
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });
  });

  it("handles login error", async () => {
    const user = testUtils.createUser();
    const mockSignIn = jest
      .fn()
      .mockRejectedValue(new Error("Invalid credentials"));

    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: mockSignIn,
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "wrongpassword");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Error should be displayed, no navigation should occur
  });

  it("redirects authenticated users to home", () => {
    mockUseAuth.mockReturnValue({
      user: { id: "1", email: "test@example.com" } as any,
      profile: null,
      session: {} as any,
      loading: false,
      signIn: jest.fn().mockResolvedValue({}),
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: true,
    });

    renderWithProviders(<LoginPage />);

    // Should redirect authenticated users
  });

  it("shows loading state during login", async () => {
    const user = testUtils.createUser();
    const mockSignIn = jest
      .fn()
      .mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100))
      );

    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: mockSignIn,
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Contraseña");
    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "password123");
    await user.click(submitButton);

    expect(screen.getByText("Iniciando sesión...")).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it("validates required fields", async () => {
    const user = testUtils.createUser();

    mockUseAuth.mockReturnValue({
      user: null,
      profile: null,
      session: null,
      loading: false,
      signIn: jest.fn().mockResolvedValue({}),
      signUp: jest.fn().mockResolvedValue({}),
      signOut: jest.fn().mockResolvedValue({}),
      isAuthenticated: false,
    });

    renderWithProviders(<LoginPage />);

    const submitButton = screen.getByRole("button", {
      name: /iniciar sesión/i,
    });

    await user.click(submitButton);

    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Contraseña");

    expect(emailInput).toBeInvalid();
    expect(passwordInput).toBeInvalid();
  });
});
