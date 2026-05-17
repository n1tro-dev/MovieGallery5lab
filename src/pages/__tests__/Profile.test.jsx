import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MovieContext } from "../../MovieContext";
import Profile from "../Profile";

const renderWithContext = (overrides = {}) => {
  const value = {
    movies: [{ id: 1 }, { id: 2 }, { id: 3 }],
    favorites: [1],
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };

  render(
    <MovieContext.Provider value={value}>
      <Profile />
    </MovieContext.Provider>,
  );

  return value;
};

describe("Profile", () => {
  it("renders stats and login button when logged out", () => {
    const context = renderWithContext();

    expect(screen.getByText("Total Movies")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("Favorites")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Status: Not authorized")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(context.login).toHaveBeenCalledTimes(1);
  });

  it("renders logout button when authenticated", () => {
    const context = renderWithContext({ isAuthenticated: true });

    expect(screen.getByText("Status: Authorized")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));
    expect(context.logout).toHaveBeenCalledTimes(1);
  });
});
