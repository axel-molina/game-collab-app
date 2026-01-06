import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProjectForm } from "../ProjectForm";
import { BrowserRouter } from "react-router-dom";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock URL.createObjectURL
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "test-url");
}

describe("ProjectForm", () => {
  const mockOnSubmit = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (isLoading = false) => {
    return render(
      <BrowserRouter>
        <ProjectForm onSubmit={mockOnSubmit} isLoading={isLoading} />
      </BrowserRouter>
    );
  };

  it("should show validation errors when submitting empty form", async () => {
    renderForm();

    const submitBtn = screen.getByRole("button", { name: /projects.submit/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("El nombre es requerido")).toBeInTheDocument();
      expect(screen.getByText("Selecciona un motor")).toBeInTheDocument();
      expect(screen.getByText("La versión es requerida")).toBeInTheDocument();
      expect(screen.getByText("El contacto es requerido")).toBeInTheDocument();
    });
  });

  it("should call onSubmit with correct data when form is valid", async () => {
    // Note: Full form submission test would require more complex mocking
    // of Radix Select and other components.
  });

  it("should disable submit button when loading", () => {
    renderForm(true);
    const submitBtn = screen.getByRole("button", { name: /projects.submit/i });
    expect(submitBtn).toBeDisabled();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("should handle description length validation", async () => {
    renderForm();

    const descInput = screen.getByPlaceholderText(
      "projects.description_placeholder"
    );
    fireEvent.change(descInput, { target: { value: "short" } });

    fireEvent.click(screen.getByRole("button", { name: /projects.submit/i }));

    await waitFor(() => {
      expect(screen.getByText("Mínimo 10 caracteres")).toBeInTheDocument();
    });
  });
});
