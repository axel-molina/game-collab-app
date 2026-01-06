import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import {
  useCreatePost,
  extractTitleFromContent,
  extractExcerptFromContent,
} from "../useProjectPosts";
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
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(),
      })),
    },
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

describe("useProjectPosts Helpers", () => {
  describe("extractTitleFromContent", () => {
    it("should extract title from markdown heading", () => {
      const content = "# My Awesome Project\nThis is a description.";
      expect(extractTitleFromContent(content)).toBe("My Awesome Project");
    });

    it("should return 'Sin título' if content is empty", () => {
      expect(extractTitleFromContent("")).toBe("Sin título");
    });

    it("should handle content without markdown heading", () => {
      const content = "Just some content";
      expect(extractTitleFromContent(content)).toBe("Just some content");
    });

    it("should trim whitespace", () => {
      const content = "#   Title with spaces   ";
      expect(extractTitleFromContent(content)).toBe("Title with spaces");
    });
  });

  describe("extractExcerptFromContent", () => {
    it("should skip title and return content excerpt", () => {
      const content =
        "# Title\nThis is the content that should be in the excerpt.";
      expect(extractExcerptFromContent(content)).toContain(
        "This is the content"
      );
      expect(extractExcerptFromContent(content)).not.toContain("Title");
    });

    it("should truncate long content", () => {
      const content = "# Title\n" + "a".repeat(200);
      const excerpt = extractExcerptFromContent(content, 100);
      expect(excerpt.length).toBe(103); // 100 + "..."
      expect(excerpt.endsWith("...")).toBe(true);
    });

    it("should handle content without title line", () => {
      const content = "Only content here";
      expect(extractExcerptFromContent(content)).toBe("");
    });
  });
});

describe("useCreatePost hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a post successfully", async () => {
    const mockUser = { id: "user-123" };
    const mockProject = { id: "p-1", user_id: "user-123" };

    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
    });

    // Mock project ownership check and insert
    const mockSelect = vi.fn().mockReturnThis();
    const mockEq = vi.fn().mockReturnThis();
    const mockSingle = vi.fn();
    const mockInsert = vi.fn().mockReturnThis();

    (supabase.from as any).mockReturnValue({
      select: mockSelect,
      eq: mockEq,
      single: mockSingle,
      insert: mockInsert,
    });

    // First single call returns checking project ownership
    mockSingle.mockResolvedValueOnce({ data: mockProject, error: null });
    // Second single call returns the created post
    mockSingle.mockResolvedValueOnce({ data: { id: "post-1" }, error: null });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });

    await result.current.mutateAsync({
      project_id: "p-1",
      title: "Post Title",
      content: "Post Content",
    });

    // Verify inserted content
    expect(mockInsert).toHaveBeenCalledWith({
      project_id: "p-1",
      user_id: "user-123",
      content: "# Post Title\n\nPost Content",
    });
  });

  it("should fail if user is not project owner", async () => {
    const mockUser = { id: "user-123" };
    const mockProject = { id: "p-1", user_id: "other-user" };

    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
    });

    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: mockProject, error: null });
    (supabase.from as any).mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: mockSingle,
    });

    const { result } = renderHook(() => useCreatePost(), {
      wrapper: createWrapper(),
    });

    await expect(
      result.current.mutateAsync({
        project_id: "p-1",
        title: "Post Title",
        content: "Post Content",
      })
    ).rejects.toThrow("You don't own this project");
  });
});
