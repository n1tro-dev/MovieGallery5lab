import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MovieContext } from "../../MovieContext";
import MoviesPage from "../MoviesPage";

const createMovie = (id) => ({
  id,
  title: `Movie ${id}`,
  genre: id % 2 === 0 ? "Action" : "Drama",
  rating: 7.5,
  year: 2010 + (id % 10),
  description: `Description for movie ${id}`,
  poster: `https://example.com/poster-${id}.jpg`,
});

const renderWithContext = (overrides = {}) => {
  const value = {
    movies: Array.from({ length: 10 }, (_, index) => createMovie(index + 1)),
    favorites: [],
    toggleFavorite: vi.fn(),
    addMovie: vi.fn().mockResolvedValue({ id: 100 }),
    deleteMovie: vi.fn().mockResolvedValue(true),
    updateMovie: vi.fn().mockResolvedValue({ id: 1 }),
    apiLoading: false,
    apiError: null,
    updateError: null,
    mutationError: null,
    creatingMovie: false,
    deletingMovieId: null,
    updatingMovieId: null,
    refetchMovies: vi.fn(),
    ...overrides,
  };

  render(
    <MovieContext.Provider value={value}>
      <MoviesPage />
    </MovieContext.Provider>,
  );

  return value;
};

describe("MoviesPage", () => {
  it("renders paginated list and can switch pages", () => {
    renderWithContext();

    expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
    expect(screen.getByText("Movie 1")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Delete movie" }),
    ).toHaveLength(8);
    expect(screen.queryByText("Movie 9")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(screen.getByText("Movie 8")).toBeInTheDocument();
    expect(screen.getByText("Movie 9")).toBeInTheDocument();
  });

  it("validates create form and calls addMovie on valid submit", async () => {
    const context = renderWithContext();

    fireEvent.click(screen.getByRole("button", { name: "+ Add New" }));

    const titleInput = screen.getByPlaceholderText("Title");
    fireEvent.change(titleInput, { target: { value: "ab" } });
    fireEvent.blur(titleInput);

    expect(
      screen.getByText("Название должно быть не короче 3 символов"),
    ).toBeInTheDocument();

    fireEvent.change(titleInput, { target: { value: "Inception" } });
    fireEvent.change(screen.getByDisplayValue("Select Genre"), {
      target: { value: "Action" },
    });
    fireEvent.change(screen.getByPlaceholderText("Year"), {
      target: { value: "2010" },
    });
    fireEvent.change(screen.getByPlaceholderText("Rating"), {
      target: { value: "8.8" },
    });
    fireEvent.change(screen.getByPlaceholderText("Poster URL"), {
      target: { value: "https://example.com/new-movie.jpg" },
    });
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Very long valid description" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Create" }));

    await waitFor(() => expect(context.addMovie).toHaveBeenCalledTimes(1));
  });

  it("calls deleteMovie from card action", async () => {
    const context = renderWithContext();

    fireEvent.click(screen.getAllByRole("button", { name: "Delete movie" })[0]);

    await waitFor(() => expect(context.deleteMovie).toHaveBeenCalledTimes(1));
    expect(context.deleteMovie).toHaveBeenCalledWith(1);
  });
});
