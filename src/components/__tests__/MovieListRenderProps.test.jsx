import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import MovieListRenderProps from "../MovieListRenderProps";

const movies = [
  { id: 1, title: "Interstellar", genre: "Sci-Fi", rating: 8.6 },
  { id: 2, title: "Batman", genre: "Action", rating: 7.9 },
  { id: 3, title: "Arrival", genre: "Sci-Fi", rating: 8.1 },
];

describe("MovieListRenderProps", () => {
  it("calls render function with filtered and sorted items", () => {
    const renderFn = vi.fn(({ items }) => (
      <div>
        <p>Count: {items.length}</p>
        {items.map((item) => (
          <span key={item.id}>{item.title}</span>
        ))}
      </div>
    ));

    render(
      <MovieListRenderProps items={movies}>{renderFn}</MovieListRenderProps>,
    );

    expect(renderFn).toHaveBeenCalled();
    expect(screen.getByText("Count: 3")).toBeInTheDocument();

    fireEvent.change(
      screen.getByPlaceholderText("Search by title or genre..."),
      {
        target: { value: "Sci-Fi" },
      },
    );

    expect(screen.getByText("Count: 2")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("Arrival")).toBeInTheDocument();
  });
});
