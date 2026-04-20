import { useMemo } from "react";

export const useFilter = (movies, filters) => {
  const { searchTerm = "", selectedGenre = "All", sortBy = "title" } = filters;

  const uniqueGenres = useMemo(
    () => ["All", ...new Set(movies.map((movie) => movie.genre).filter(Boolean))],
    [movies],
  );

  const filteredMovies = useMemo(() => {
    const filtered = movies.filter((movie) => {
      const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase().trim());

      return matchesGenre && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "rating") {
        return Number(b.rating) - Number(a.rating);
      }

      if (sortBy === "year") {
        return Number(b.year) - Number(a.year);
      }

      return a.title.localeCompare(b.title);
    });
  }, [movies, searchTerm, selectedGenre, sortBy]);

  return { filteredMovies, uniqueGenres };
};
