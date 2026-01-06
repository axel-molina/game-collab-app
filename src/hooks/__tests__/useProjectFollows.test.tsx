import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProjectFollows } from "../useProjectFollows";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
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

describe("useProjectFollows hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should follow a project successfully", async () => {
    // Shared mocks to capture calls
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnThis();

    // Mock initial state: user not following (empty list)
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "project_followers") {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          insert: mockInsert,
          delete: mockDelete,
          then: (resolve: any) => resolve({ data: [], error: null }),
        };
        return mockChain;
      }
      return { select: vi.fn() };
    });

    const { result } = renderHook(() => useProjectFollows("user-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await result.current.toggleFollow.mutateAsync({
      projectId: "p-1",
      userId: "user-123",
    });

    // Should call insert
    expect(mockInsert).toHaveBeenCalledWith([
      { project_id: "p-1", user_id: "user-123" },
    ]);
  });

  it("should unfollow a project successfully", async () => {
    // Shared mocks to capture calls
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockDelete = vi.fn().mockReturnThis();

    // Mock initial state: user IS following project p-1
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === "project_followers") {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          insert: mockInsert,
          delete: mockDelete,
          then: (resolve: any) =>
            resolve({ data: [{ project_id: "p-1" }], error: null }),
        };
        return mockChain;
      }
      return { select: vi.fn() };
    });

    const { result } = renderHook(() => useProjectFollows("user-123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    // Verify initial state
    expect(result.current.isFollowing("p-1")).toBe(true);

    await result.current.toggleFollow.mutateAsync({
      projectId: "p-1",
      userId: "user-123",
    });

    // Should call delete
    expect(mockDelete).toHaveBeenCalled();
  });
});
