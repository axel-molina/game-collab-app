import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useCreateComment } from "../usePostComments";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn(),
      insert: vi.fn().mockReturnThis(),
    })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCreateComment hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a comment successfully", async () => {
    const mockUser = { id: "user-123" };
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
    });

    const mockInsert = vi.fn().mockReturnThis();
    const mockSingle = vi.fn();

    // Mock post fetch
    mockSingle.mockResolvedValueOnce({
      data: { user_id: "post-owner" },
      error: null,
    });
    // Mock insert result
    mockSingle.mockResolvedValueOnce({
      data: { id: "comment-1" },
      error: null,
    });

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
      insert: mockInsert,
    });

    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      post_id: "post-1",
      content: "Great post!",
    });

    expect(mockInsert).toHaveBeenCalledWith({
      post_id: "post-1",
      user_id: "user-123",
      content: "Great post!",
      parent_id: null,
    });
  });

  it("should create a reply successfully", async () => {
    const mockUser = { id: "user-123" };
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
    });

    const mockSingle = vi.fn();

    // Mock post fetch
    mockSingle.mockResolvedValueOnce({
      data: { user_id: "post-owner" },
      error: null,
    });
    // Mock parent comment fetch
    mockSingle.mockResolvedValueOnce({
      data: { user_id: "comment-owner" },
      error: null,
    });
    // Mock insert result
    mockSingle.mockResolvedValueOnce({ data: { id: "reply-1" }, error: null });

    const mockInsert = vi.fn().mockReturnThis();

    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
      insert: mockInsert,
    });

    const { result } = renderHook(() => useCreateComment(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      post_id: "post-1",
      content: "Great reply!",
      parent_id: "parent-1",
    });

    expect(mockInsert).toHaveBeenCalledWith({
      post_id: "post-1",
      user_id: "user-123",
      content: "Great reply!",
      parent_id: "parent-1",
    });
  });
});
