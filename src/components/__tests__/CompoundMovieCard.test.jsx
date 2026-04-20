import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import CompoundMovieCard from "../CompoundMovieCard";

const movie = {
  id: 5,
  title: "The Matrix",
  genre: "Action",
  rating: 8.7,
  year: 1999,
};

describe("CompoundMovieCard", () => {
  it("renders header, body and footer actions", () => {
    const onOpenDetails = vi.fn();

    render(
      <CompoundMovieCard movie={movie}>
        <CompoundMovieCard.Header />
        <CompoundMovieCard.Body />
        <CompoundMovieCard.Footer onOpenDetails={onOpenDetails} />
      </CompoundMovieCard>,
    );

    expect(screen.getByText("The Matrix")).toBeInTheDocument();
    expect(screen.getByText(/1999/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Mark watched" }));
    expect(screen.getByRole("button", { name: "Watched" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Details" }));
    expect(onOpenDetails).toHaveBeenCalledWith(5);
  });
});
