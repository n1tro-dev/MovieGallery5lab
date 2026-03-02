import React, { useContext, useState, useMemo } from "react";
import { MovieContext } from "../MovieContext";
import MovieCard from "./MovieCard";

const MoviesPage = () => {
  const { movies, favorites, toggleFavorite, addMovie, deleteMovie } =
    useContext(MovieContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // (Задача №2, 3, 5)
  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    rating: "",
    poster: "",
    year: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  // (Задача №5)
  const validate = (name, value) => {
    let error = "";
    if (name === "title" && value.length < 3)
      error = "Название слишком короткое";
    if (name === "rating" && (value < 0 || value > 10))
      error = "Рейтинг от 0 до 10";
    if (name === "year" && (value < 1895 || value > 2026))
      error = "Некорректный год";
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMovie((prev) => ({ ...prev, [name]: value }));
    validate(name, value);
  };

  // (Задача №8)
  const filteredMovies = useMemo(() => {
    return movies
      .filter(
        (m) =>
          (selectedGenre === "All" || m.genre === selectedGenre) &&
          m.title.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) =>
        sortBy === "rating"
          ? b.rating - a.rating
          : a.title.localeCompare(b.title),
      );
  }, [movies, searchTerm, selectedGenre, sortBy]);

  const uniqueGenres = useMemo(
    () => ["All", ...new Set(movies.map((m) => m.genre))],
    [movies],
  );

  return (
    <div className="page">
      <h1>Movie Gallery</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {uniqueGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{ background: "var(--accent)", color: "white" }}
        >
          + Add New
        </button>
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.includes(movie.id)}
            onToggleFav={toggleFavorite}
            onDelete={deleteMovie}
            onOpen={setSelectedMovie}
          />
        ))}
      </div>

      {/* МОДАЛКА ДОБАВЛЕНИЯ (Задача №1, 3, 6) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form
              className="add-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!errors.title && newMovie.title) {
                  addMovie(newMovie);
                  setIsAddModalOpen(false);
                }
              }}
            >
              <h2>New Movie</h2>
              <input
                name="title"
                placeholder="Title"
                value={newMovie.title}
                onChange={handleChange}
                required
              />
              {errors.title && (
                <span style={{ color: "red", fontSize: "0.8rem" }}>
                  {errors.title}
                </span>
              )}

              <select
                name="genre"
                value={newMovie.genre}
                onChange={handleChange}
                required
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
                <option value="Sci-Fi">Sci-Fi</option>
              </select>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  name="year"
                  type="number"
                  placeholder="Year"
                  onChange={handleChange}
                />
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="Rating"
                  onChange={handleChange}
                />
              </div>
              <input
                name="poster"
                placeholder="Poster URL"
                onChange={handleChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                onChange={handleChange}
              />

              <button
                type="submit"
                style={{ background: "var(--accent)", color: "white" }}
              >
                Create
              </button>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА ДЕТАЛЕЙ */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedMovie.poster} alt="" />
            <h2>{selectedMovie.title}</h2>
            <p>
              ⭐ {selectedMovie.rating} | {selectedMovie.genre}
            </p>
            <p>{selectedMovie.description}</p>
            <button
              className="add-form button"
              onClick={() => setSelectedMovie(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
