import React, { useContext, useState } from "react";
import { MovieContext } from "../MovieContext";
import MovieCard from "./MovieCard";
import { useFilter } from "../hooks/useFilter";
import { useForm } from "../hooks/useForm";

const INITIAL_FORM_VALUES = {
  title: "",
  genre: "",
  rating: "",
  poster: "",
  year: "",
  description: "",
};

const currentYear = new Date().getFullYear();

const validateMovie = (values) => {
  const errors = {};

  if (!values.title.trim() || values.title.trim().length < 3) {
    errors.title = "Название должно быть не короче 3 символов";
  }

  if (!values.genre) {
    errors.genre = "Выберите жанр";
  }

  const rating = Number(values.rating);
  if (Number.isNaN(rating) || rating < 0 || rating > 10) {
    errors.rating = "Рейтинг от 0 до 10";
  }

  const year = Number(values.year);
  if (Number.isNaN(year) || year < 1895 || year > currentYear) {
    errors.year = `Год должен быть между 1895 и ${currentYear}`;
  }

  try {
    // URL constructor throws for invalid values.
    new URL(values.poster);
  } catch {
    errors.poster = "Введите корректный URL постера";
  }

  if (!values.description.trim() || values.description.trim().length < 10) {
    errors.description = "Описание должно быть не короче 10 символов";
  }

  return errors;
};

const MoviesPage = () => {
  const {
    movies,
    favorites,
    toggleFavorite,
    addMovie,
    deleteMovie,
    apiLoading,
    apiError,
    refetchMovies,
  } = useContext(MovieContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { filteredMovies, uniqueGenres } = useFilter(movies, {
    searchTerm,
    selectedGenre,
    sortBy,
  });

  const {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm({
    initialValues: INITIAL_FORM_VALUES,
    validate: validateMovie,
    onSubmit: (formValues, { resetForm }) => {
      addMovie({
        ...formValues,
        title: formValues.title.trim(),
        description: formValues.description.trim(),
      });
      setIsAddModalOpen(false);
      resetForm();
    },
  });

  const openCreateModal = () => {
    setIsAddModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsAddModalOpen(false);
  };

  const getFieldError = (fieldName) =>
    touched[fieldName] && errors[fieldName] ? errors[fieldName] : "";

  const renderError = (fieldName) => {
    const fieldError = getFieldError(fieldName);

    if (!fieldError) {
      return null;
    }

    return (
      <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldError}</span>
    );
  };

  return (
    <div className="page">
      <h1>Movie Gallery</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          value={searchTerm}
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
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
          <option value="year">Sort by Year</option>
        </select>
        <button
          onClick={openCreateModal}
          style={{ background: "var(--accent)", color: "white" }}
        >
          + Add New
        </button>
      </div>

      {apiLoading && <p>Loading movies from API...</p>}

      {apiError && (
        <div className="stats" style={{ marginBottom: "24px" }}>
          <p>Could not refresh movies from API. Showing cached/local data.</p>
          <button onClick={refetchMovies}>Try again</button>
        </div>
      )}

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

      {isAddModalOpen && (
        <div className="modal-overlay" onClick={closeCreateModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="add-form" onSubmit={handleSubmit}>
              <h2>New Movie</h2>
              <input
                name="title"
                placeholder="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {renderError("title")}

              <select
                name="genre"
                value={values.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              >
                <option value="">Select Genre</option>
                <option value="Action">Action</option>
                <option value="Drama">Drama</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Crime">Crime</option>
                <option value="Animation">Animation</option>
                <option value="Comedy">Comedy</option>
                <option value="Thriller">Thriller</option>
              </select>
              {renderError("genre")}

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  name="year"
                  type="number"
                  placeholder="Year"
                  value={values.year}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="Rating"
                  value={values.rating}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
              </div>
              {renderError("year")}
              {renderError("rating")}

              <input
                name="poster"
                placeholder="Poster URL"
                value={values.poster}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {renderError("poster")}

              <textarea
                name="description"
                placeholder="Description"
                value={values.description}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {renderError("description")}

              <button
                type="submit"
                disabled={!isValid}
                style={{ background: "var(--accent)", color: "white" }}
              >
                Create
              </button>
              <button type="button" onClick={closeCreateModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedMovie.poster} alt={selectedMovie.title} />
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
