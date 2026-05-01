import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { MovieContext } from "../../MovieContext";
import MovieDetailsPage from "../MovieDetailsPage";

const movies = [
  {
    id: 1,
    title: "Interstellar",
    genre: "Sci-Fi",
    rating: 8.6,
    year: 2014,
    description: "Space exploration.",
    poster: "https://example.com/poster.jpg",
  },
];

const renderWithRoute = (initialEntry, value) => {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <MovieContext.Provider value={value}>
        <Routes>
          <Route path="/movies/:id" element={<MovieDetailsPage />} />
        </Routes>
      </MovieContext.Provider>
    </MemoryRouter>,
  );
};

describe("MovieDetailsPage", () => {
  it("renders movie details when movie exists", () => {
    renderWithRoute("/movies/1", { movies });

    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText(/Genre:/)).toBeInTheDocument();
    expect(screen.getByText("Sci-Fi")).toBeInTheDocument();
    expect(screen.getByText(/Year:/)).toBeInTheDocument();
    expect(screen.getByText("2014")).toBeInTheDocument();
    expect(screen.getByText(/Rating:/)).toBeInTheDocument();
    expect(screen.getByText("8.6")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to gallery" }),
    ).toBeInTheDocument();
  });

  it("shows not found state when movie is missing", () => {
    renderWithRoute("/movies/999", { movies });

    expect(screen.getByText("Movie not found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Back to gallery" }),
    ).toBeInTheDocument();
  });
});
