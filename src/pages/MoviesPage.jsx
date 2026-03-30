import React, { useContext, useMemo, useState } from "react";
import { MovieContext } from "../MovieContext";
import MovieCard from "./MovieCard";
import { useFilter } from "../hooks/useFilter";
import { useForm } from "../hooks/useForm";
import { useModal } from "../hooks/useModal";

const INITIAL_FORM_VALUES = {
  title: "",
  genre: "",
  rating: "",
  poster: "",
  year: "",
  description: "",
};

const currentYear = new Date().getFullYear();
const MOVIES_PER_PAGE = 8;

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
    updateMovie,
    apiLoading,
    apiError,
    updateError,
    mutationError,
    creatingMovie,
    deletingMovieId,
    updatingMovieId,
    refetchMovies,
  } = useContext(MovieContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);

  const createModal = useModal();
  const detailsModal = useModal();
  const editModal = useModal();

  const [editValues, setEditValues] = useState(INITIAL_FORM_VALUES);
  const [editTouched, setEditTouched] = useState({});

  const { filteredMovies, uniqueGenres } = useFilter(movies, {
    searchTerm,
    selectedGenre,
    sortBy,
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMovies.length / MOVIES_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedMovies = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * MOVIES_PER_PAGE;
    return filteredMovies.slice(startIndex, startIndex + MOVIES_PER_PAGE);
  }, [filteredMovies, safeCurrentPage]);

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
      const payload = {
        ...formValues,
        title: formValues.title.trim(),
        description: formValues.description.trim(),
      };

      addMovie(payload)
        .then(() => {
          createModal.close();
          resetForm();
        })
        .catch(() => {
          // Error is rendered via context state.
        });
    },
  });

  const editErrors = useMemo(() => validateMovie(editValues), [editValues]);

  const openCreateModal = () => {
    createModal.open();
  };

  const closeCreateModal = () => {
    createModal.close();
  };

  const openDetailsModal = (movie) => {
    detailsModal.open(movie);
  };

  const openEditModal = (movie) => {
    setEditValues({
      title: movie.title || "",
      genre: movie.genre || "",
      rating: String(movie.rating ?? ""),
      poster: movie.poster || "",
      year: String(movie.year ?? ""),
      description: movie.description || "",
    });
    setEditTouched({});
    detailsModal.close();
    editModal.open(movie);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditBlur = (event) => {
    const { name } = event.target;
    setEditTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getEditFieldError = (fieldName) =>
    editTouched[fieldName] && editErrors[fieldName]
      ? editErrors[fieldName]
      : "";

  const renderEditError = (fieldName) => {
    const fieldError = getEditFieldError(fieldName);

    if (!fieldError) {
      return null;
    }

    return (
      <span style={{ color: "red", fontSize: "0.8rem" }}>{fieldError}</span>
    );
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const markedTouched = Object.keys(editValues).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});

    setEditTouched(markedTouched);

    if (Object.values(editErrors).some(Boolean) || !editModal.data) {
      return;
    }

    const payload = {
      ...editModal.data,
      ...editValues,
      title: editValues.title.trim(),
      description: editValues.description.trim(),
      year: Number(editValues.year),
      rating: Number(editValues.rating),
    };

    try {
      const updatedMovie = await updateMovie(payload);
      editModal.close();
      detailsModal.open(updatedMovie);
    } catch {
      // Error state is exposed from context and rendered in the modal.
    }
  };

  const handleDeleteMovie = (id) => {
    deleteMovie(id)
      .then(() => {
        if (detailsModal.data?.id === id) {
          detailsModal.close();
        }
      })
      .catch(() => {
        // Error is rendered via context state.
      });
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
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          value={selectedGenre}
          onChange={(e) => {
            setSelectedGenre(e.target.value);
            setCurrentPage(1);
          }}
        >
          {uniqueGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
        >
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

      {mutationError && (
        <div className="stats" style={{ marginBottom: "24px" }}>
          <p>{mutationError.message}</p>
        </div>
      )}

      <div className="movie-grid">
        {paginatedMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            isFavorite={favorites.includes(movie.id)}
            onToggleFav={toggleFavorite}
            onDelete={handleDeleteMovie}
            onOpen={openDetailsModal}
          />
        ))}
      </div>

      <div className="pagination">
        <button
          type="button"
          disabled={safeCurrentPage === 1}
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
        >
          Prev
        </button>
        <span>
          Page {safeCurrentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={safeCurrentPage === totalPages}
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
        >
          Next
        </button>
      </div>

      {createModal.isOpen && (
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
                disabled={!isValid || creatingMovie}
                style={{ background: "var(--accent)", color: "white" }}
              >
                {creatingMovie ? "Creating..." : "Create"}
              </button>
              <button type="button" onClick={closeCreateModal}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {detailsModal.isOpen && detailsModal.data && (
        <div className="modal-overlay" onClick={detailsModal.close}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={detailsModal.data.poster} alt={detailsModal.data.title} />
            <h2>{detailsModal.data.title}</h2>
            <p>
              ⭐ {detailsModal.data.rating} | {detailsModal.data.genre}
            </p>
            <p>{detailsModal.data.description}</p>
            <div className="modal-actions">
              <button
                className="fav-btn"
                onClick={() => openEditModal(detailsModal.data)}
              >
                Edit
              </button>
              <button
                className="fav-btn"
                onClick={() => handleDeleteMovie(detailsModal.data.id)}
                disabled={deletingMovieId === detailsModal.data.id}
              >
                {deletingMovieId === detailsModal.data.id
                  ? "Deleting..."
                  : "Delete"}
              </button>
              <button className="fav-btn" onClick={detailsModal.close}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal.isOpen && editModal.data && (
        <div className="modal-overlay" onClick={editModal.close}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="add-form" onSubmit={handleEditSubmit}>
              <h2>Edit Movie</h2>

              <input
                name="title"
                placeholder="Title"
                value={editValues.title}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                required
              />
              {renderEditError("title")}

              <select
                name="genre"
                value={editValues.genre}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
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
              {renderEditError("genre")}

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  name="year"
                  type="number"
                  placeholder="Year"
                  value={editValues.year}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  required
                />
                <input
                  name="rating"
                  type="number"
                  step="0.1"
                  placeholder="Rating"
                  value={editValues.rating}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  required
                />
              </div>
              {renderEditError("year")}
              {renderEditError("rating")}

              <input
                name="poster"
                placeholder="Poster URL"
                value={editValues.poster}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                required
              />
              {renderEditError("poster")}

              <textarea
                name="description"
                placeholder="Description"
                value={editValues.description}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                required
              />
              {renderEditError("description")}

              {updateError && (
                <span style={{ color: "red", fontSize: "0.85rem" }}>
                  {updateError.message}
                </span>
              )}

              <button
                type="submit"
                disabled={
                  Object.values(editErrors).some(Boolean) ||
                  updatingMovieId === editModal.data.id
                }
                style={{ background: "var(--accent)", color: "white" }}
              >
                {updatingMovieId === editModal.data.id
                  ? "Updating..."
                  : "Save changes"}
              </button>
              <button type="button" onClick={editModal.close}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
