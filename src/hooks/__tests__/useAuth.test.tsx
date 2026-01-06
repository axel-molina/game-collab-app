import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../useAuth";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
      getSession: vi.fn().mockResolvedValue({
        data: { session: null },
      }),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      resetPasswordForEmail: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn(),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe("useAuth hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sign up a user successfully", async () => {
    const mockUser = { id: "123", email: "test@example.com" };
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: mockUser, session: {} },
      error: null,
    });

    // Mock profile check - profile doesn't exist
    const mockMaybeSingle = vi.fn().mockResolvedValue({ data: null });
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "profiles") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: mockMaybeSingle,
          insert: mockInsert,
        };
      }
      return {
        select: vi.fn().mockReturnThis(),
      };
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signUp("test@example.com", "password", "testuser");
    });

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password",
      options: {
        emailRedirectTo: expect.any(String),
        data: { username: "testuser" },
      },
    });

    // Verify profile creation attempt
    expect(mockInsert).toHaveBeenCalledWith({
      id: "123",
      username: "testuser",
      email: "test@example.com",
    });
  });

  it("should handle sign up error", async () => {
    (supabase.auth.signUp as any).mockResolvedValue({
      data: { user: null },
      error: { message: "Error creating user" },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    let response;
    await act(async () => {
      response = await result.current.signUp(
        "test@example.com",
        "password",
        "testuser"
      );
    });

    expect(response.error).toEqual({ message: "Error creating user" });
  });
});
