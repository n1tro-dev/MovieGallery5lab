import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import NotFound from "../NotFound";

beforeEach(() => {
  localStorage.clear();
});

describe("NotFound", () => {
  it("renders 404 message and back button", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>,
    );

    expect(screen.getByText("404 - Page Not Found")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Back to Home" }),
    ).toBeInTheDocument();
  });
});
