import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

const mockShows = [
  {
    id: 101,
    name: "Test Show",
    genres: ["Drama"],
    rating: { average: 7.4 },
    premiered: "2021-01-01",
    summary: "<p>Simple summary</p>",
    image: { medium: "https://example.com/a.jpg" },
  },
];

beforeEach(() => {
  localStorage.clear();

  vi.stubGlobal(
    "fetch",
    vi.fn((url, options = {}) => {
      const method = options.method || "GET";

      if (method === "POST") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 777 }),
        });
      }

      if (method === "PUT") {
        return Promise.resolve({
          ok: true,
          json: async () => ({ id: 101 }),
        });
      }

      if (method === "DELETE") {
        return Promise.resolve({ ok: true });
      }

      return Promise.resolve({
        ok: true,
        json: async () => mockShows,
      });
    }),
  );
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("App integration", () => {
  it("protects ratings page until user logs in", async () => {
    render(<App />);

    expect(
      await screen.findByText("Welcome to Movie Gallery!"),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Ratings" }));
    expect(await screen.findByText("Access denied")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("link", { name: "Profile" }));
    fireEvent.click(await screen.findByRole("button", { name: "Login" }));

    fireEvent.click(screen.getByRole("link", { name: "Ratings" }));
    expect(await screen.findByText("Top Ratings")).toBeInTheDocument();
    expect(await screen.findByText("Test Show")).toBeInTheDocument();
  });
});
