import React, { useMemo, useState } from "react";

const MovieListRenderProps = ({ items, children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("rating");

  const genres = useMemo(() => {
    const genreSet = new Set(items.map((item) => item.genre || "Unknown"));
    return ["All", ...genreSet];
  }, [items]);

  const visibleItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return items
      .filter((item) => {
        const matchesTerm =
          !term ||
          item.title.toLowerCase().includes(term) ||
          item.genre.toLowerCase().includes(term);
        const matchesGenre =
          selectedGenre === "All" || item.genre === selectedGenre;
        return matchesTerm && matchesGenre;
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }

        return Number(b.rating) - Number(a.rating);
      });
  }, [items, searchTerm, selectedGenre, sortBy]);

  return (
    <div>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by title or genre..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <select
          value={selectedGenre}
          onChange={(event) => setSelectedGenre(event.target.value)}
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="rating">Sort by rating</option>
          <option value="title">Sort by title</option>
        </select>
      </div>

      {children({
        items: visibleItems,
        controls: {
          searchTerm,
          selectedGenre,
          sortBy,
        },
      })}
    </div>
  );
};

export default MovieListRenderProps;
