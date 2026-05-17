import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MovieContext } from "../../MovieContext";
import RatingsPage from "../RatingsPage";

const movies = [
  {
    id: 101,
    title: "The Test Movie",
    genre: "Drama",
    rating: 8.1,
    year: 2020,
    description: "Test description",
    poster: "https://example.com/poster.jpg",
  },
];

describe("RatingsPage", () => {
  it("renders top ratings and movie list", async () => {
    render(
      <MemoryRouter>
        <MovieContext.Provider value={{ movies }}>
          <RatingsPage />
        </MovieContext.Provider>
      </MemoryRouter>,
    );

    expect(screen.getByText("Top Ratings")).toBeInTheDocument();
    expect(await screen.findByText("The Test Movie")).toBeInTheDocument();
  });
});
