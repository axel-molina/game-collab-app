import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useProjects, useCreateProject } from "../useProjects";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import React from "react";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      ilike: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      single: vi.fn(),
    })),
    auth: {
      getUser: vi.fn(),
    },
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

describe("useProjects hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch projects successfully", async () => {
    const mockData = [{ id: "1", name: "Project 1" }];
    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    }));

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it("should apply engine filter", async () => {
    const mockEq = vi.fn().mockReturnThis();
    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: mockEq.mockResolvedValue({ data: [], error: null }),
    }));

    const { result } = renderHook(() => useProjects({ engine: "unity" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEq).toHaveBeenCalledWith("engine", "unity");
  });

  it("should handle search filter", async () => {
    const mockIlike = vi.fn().mockReturnThis();
    (supabase.from as any).mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      ilike: mockIlike.mockResolvedValue({ data: [], error: null }),
    }));

    const { result } = renderHook(() => useProjects({ search: "test" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockIlike).toHaveBeenCalledWith("name", "%test%");
  });
});

describe("useCreateProject hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a project successfully", async () => {
    const mockUser = { id: "user-123" };
    (supabase.auth.getUser as any).mockResolvedValue({
      data: { user: mockUser },
    });

    const mockProject = { id: "p-1", name: "New Project" };
    const mockInsert = vi.fn().mockReturnThis();
    const mockSingle = vi
      .fn()
      .mockResolvedValue({ data: mockProject, error: null });

    (supabase.from as any).mockReturnValue({
      insert: mockInsert,
      select: vi.fn().mockReturnThis(),
      single: mockSingle,
    });

    const { result } = renderHook(() => useCreateProject(), {
      wrapper: createWrapper(),
    });

    const newProjectData = {
      name: "New Project",
      engine: "Unity",
      engine_version: "2022.3",
      description: "A cool game",
      contact: "discord",
      images: [],
      tasks: [],
      positions: [],
    };

    await result.current.mutateAsync(newProjectData);

    expect(mockInsert).toHaveBeenCalledWith({
      user_id: mockUser.id,
      name: newProjectData.name,
      engine: newProjectData.engine,
      custom_engine: null,
      engine_version: newProjectData.engine_version,
      description: newProjectData.description,
      contact: newProjectData.contact,
    });
  });
});
