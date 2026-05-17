import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "../Home";

describe("Home", () => {
  it("renders welcome copy", () => {
    render(<Home />);

    expect(
      screen.getByText("Welcome to Movie Gallery!"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Discover, search, and save your favorite movies."),
    ).toBeInTheDocument();
  });
});
