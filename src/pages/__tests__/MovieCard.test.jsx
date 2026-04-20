import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MovieCard from "../MovieCard";

const movie = {
  id: 42,
  title: "Blade Runner",
  genre: "Sci-Fi",
  rating: 8.1,
  year: 1982,
  poster: "https://example.com/poster.jpg",
  description: "A blade runner must pursue and terminate replicants.",
};

describe("MovieCard", () => {
  it("renders movie content", () => {
    render(
      <MovieCard
        movie={movie}
        isFavorite={false}
        onToggleFav={vi.fn()}
        onDelete={vi.fn()}
        onOpen={vi.fn()}
      />,
    );

    expect(screen.getByText("Blade Runner")).toBeInTheDocument();
    expect(screen.getByText(/1982/)).toBeInTheDocument();
    expect(screen.getByAltText("Blade Runner")).toHaveAttribute(
      "src",
      "https://example.com/poster.jpg",
    );
  });

  it("calls onOpen when card is clicked", () => {
    const onOpen = vi.fn();

    render(
      <MovieCard
        movie={movie}
        isFavorite={false}
        onToggleFav={vi.fn()}
        onDelete={vi.fn()}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByText("Blade Runner"));

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledWith(movie);
  });

  it("toggles favorite without opening modal", () => {
    const onOpen = vi.fn();
    const onToggleFav = vi.fn();

    render(
      <MovieCard
        movie={movie}
        isFavorite={false}
        onToggleFav={onToggleFav}
        onDelete={vi.fn()}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Add to favorites" }));

    expect(onToggleFav).toHaveBeenCalledWith(42);
    expect(onOpen).not.toHaveBeenCalled();
  });

  it("deletes movie without opening modal", () => {
    const onOpen = vi.fn();
    const onDelete = vi.fn();

    render(
      <MovieCard
        movie={movie}
        isFavorite={true}
        onToggleFav={vi.fn()}
        onDelete={onDelete}
        onOpen={onOpen}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Delete movie" }));

    expect(onDelete).toHaveBeenCalledWith(42);
    expect(onOpen).not.toHaveBeenCalled();
  });
});
