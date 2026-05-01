import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useFilter } from "../useFilter";

const movies = [
  { id: 1, title: "Interstellar", genre: "Sci-Fi", rating: 8.6, year: 2014 },
  { id: 2, title: "Inception", genre: "Sci-Fi", rating: 8.8, year: 2010 },
  { id: 3, title: "Gladiator", genre: "Action", rating: 8.5, year: 2000 },
];

describe("useFilter", () => {
  it("filters by search and genre", () => {
    const { result } = renderHook(() =>
      useFilter(movies, {
        searchTerm: "in",
        selectedGenre: "Sci-Fi",
        sortBy: "title",
      }),
    );

    expect(result.current.filteredMovies).toHaveLength(2);
    expect(result.current.filteredMovies.map((item) => item.title)).toEqual([
      "Inception",
      "Interstellar",
    ]);
  });

  it("sorts by rating and exposes unique genres", () => {
    const { result } = renderHook(() =>
      useFilter(movies, {
        searchTerm: "",
        selectedGenre: "All",
        sortBy: "rating",
      }),
    );

    expect(result.current.filteredMovies[0].title).toBe("Inception");
    expect(result.current.uniqueGenres).toEqual(["All", "Sci-Fi", "Action"]);
  });
});
