import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../MovieContext";
import MovieCard from "./MovieCard";
import { useFilter } from "../hooks/useFilter";
import { useForm } from "../hooks/useForm";
import { useModal } from "../hooks/useModal";

const INITIAL_CREATE_FORM_VALUES = {
  title: "",
  genre: "",
  rating: "",
  year: "",
};

const INITIAL_EDIT_FORM_VALUES = {
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
    searchTerm: searchTermFromContext,
    selectedGenre: selectedGenreFromContext,
    sortBy: sortByFromContext,
    currentPage: currentPageFromContext,
    setSearchTerm: setSearchTermFromContext,
    setSelectedGenre: setSelectedGenreFromContext,
    setSortBy: setSortByFromContext,
    setCurrentPage: setCurrentPageFromContext,
    notification,
    clearNotification,
  } = useContext(MovieContext);
  const navigate = useNavigate();

  const [fallbackSearchTerm, setFallbackSearchTerm] = useState("");
  const [fallbackSelectedGenre, setFallbackSelectedGenre] = useState("All");
  const [fallbackSortBy, setFallbackSortBy] = useState("title");
  const [fallbackCurrentPage, setFallbackCurrentPage] = useState(1);

  const searchTerm = searchTermFromContext ?? fallbackSearchTerm;
  const selectedGenre = selectedGenreFromContext ?? fallbackSelectedGenre;
  const sortBy = sortByFromContext ?? fallbackSortBy;
  const currentPage = currentPageFromContext ?? fallbackCurrentPage;

  const setSearchTerm = setSearchTermFromContext ?? setFallbackSearchTerm;
  const setSelectedGenre =
    setSelectedGenreFromContext ?? setFallbackSelectedGenre;
  const setSortBy = setSortByFromContext ?? setFallbackSortBy;
  const setCurrentPage = setCurrentPageFromContext ?? setFallbackCurrentPage;

  const createModal = useModal();
  const detailsModal = useModal();
  const editModal = useModal();

  const isAnyModalOpen =
    createModal.isOpen || detailsModal.isOpen || editModal.isOpen;

  const [editValues, setEditValues] = useState(INITIAL_EDIT_FORM_VALUES);
  const [editTouched, setEditTouched] = useState({});

  const createPosterRef = useRef(null);
  const createDescriptionRef = useRef(null);
  const [createRefTouched, setCreateRefTouched] = useState({});
  const [createRefValues, setCreateRefValues] = useState({
    poster: "",
    description: "",
  });

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

  const { values, touched, handleChange, handleBlur, handleSubmit, resetForm } =
    useForm({
      initialValues: INITIAL_CREATE_FORM_VALUES,
      validate: (formValues) =>
        validateMovie({
          ...formValues,
          poster: createRefValues.poster,
          description: createRefValues.description,
        }),
      onSubmit: (formValues, { resetForm }) => {
        const fullFormValues = {
          ...formValues,
          poster: createRefValues.poster,
          description: createRefValues.description,
        };

        const payload = {
          ...fullFormValues,
          title: fullFormValues.title.trim(),
          description: fullFormValues.description.trim(),
        };

        addMovie(payload)
          .then(() => {
            createModal.close();
            resetForm();
            if (createPosterRef.current) {
              createPosterRef.current.value = "";
            }
            if (createDescriptionRef.current) {
              createDescriptionRef.current.value = "";
            }
            setCreateRefValues({ poster: "", description: "" });
            setCreateRefTouched({});
          })
          .catch(() => {});
      },
    });

  const createErrors = useMemo(
    () =>
      validateMovie({
        ...values,
        poster: createRefValues.poster,
        description: createRefValues.description,
      }),
    [values, createRefValues],
  );

  const isCreateFormValid = !Object.values(createErrors).some(Boolean);

  const editErrors = useMemo(() => validateMovie(editValues), [editValues]);

  const genreSuggestions = useMemo(
    () => uniqueGenres.filter((genre) => genre !== "All"),
    [uniqueGenres],
  );

  useEffect(() => {
    if (!isAnyModalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAnyModalOpen]);

  const openCreateModal = useCallback(() => {
    createModal.open();
  }, [createModal]);

  const closeCreateModal = useCallback(() => {
    createModal.close();
    resetForm();
    setCreateRefValues({ poster: "", description: "" });
    setCreateRefTouched({});
    if (createPosterRef.current) {
      createPosterRef.current.value = "";
    }
    if (createDescriptionRef.current) {
      createDescriptionRef.current.value = "";
    }
  }, [createModal, resetForm]);

  const openDetailsModal = useCallback(
    (movie) => {
      detailsModal.open(movie);
    },
    [detailsModal],
  );

  const openEditModal = useCallback(
    (movie) => {
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
    },
    [detailsModal, editModal],
  );

  const handleEditChange = useCallback((event) => {
    const { name, value } = event.target;

    setEditValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleEditBlur = useCallback((event) => {
    const { name } = event.target;
    setEditTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

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

  const handleDeleteMovie = useCallback(
    (id) => {
      deleteMovie(id)
        .then(() => {
          if (detailsModal.data?.id === id) {
            detailsModal.close();
          }
        })
        .catch(() => {
          // Error is rendered via context state.
        });
    },
    [deleteMovie, detailsModal],
  );

  const getFieldError = (fieldName) => {
    const isTouched =
      fieldName === "poster" || fieldName === "description"
        ? createRefTouched[fieldName]
        : touched[fieldName];

    return isTouched && createErrors[fieldName] ? createErrors[fieldName] : "";
  };

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

      {notification && (
        <div
          className="stats"
          style={{
            marginBottom: "24px",
            border: `1px solid ${
              notification.type === "error" ? "#dc2626" : "#16a34a"
            }`,
          }}
        >
          <p>{notification.message}</p>
          {clearNotification && (
            <button type="button" onClick={clearNotification}>
              Hide
            </button>
          )}
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-movie-title"
          >
            <form className="add-form" onSubmit={handleSubmit}>
              <h2 id="create-movie-title">New Movie</h2>
              <input
                name="title"
                placeholder="Title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {renderError("title")}

              <input
                name="genre"
                placeholder="Genre"
                list="genre-options"
                value={values.genre}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {renderError("genre")}

              <div className="form-row">
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
                ref={createPosterRef}
                value={createRefValues.poster}
                onChange={(event) =>
                  setCreateRefValues((prev) => ({
                    ...prev,
                    poster: event.target.value,
                  }))
                }
                onBlur={() =>
                  setCreateRefTouched((prev) => ({ ...prev, poster: true }))
                }
                required
              />
              {renderError("poster")}

              <textarea
                name="description"
                placeholder="Description"
                ref={createDescriptionRef}
                value={createRefValues.description}
                onChange={(event) =>
                  setCreateRefValues((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                onBlur={() =>
                  setCreateRefTouched((prev) => ({
                    ...prev,
                    description: true,
                  }))
                }
                required
              />
              {renderError("description")}

              <button
                type="submit"
                disabled={!isCreateFormValid || creatingMovie}
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="details-movie-title"
          >
            <img src={detailsModal.data.poster} alt={detailsModal.data.title} />
            <h2 id="details-movie-title">{detailsModal.data.title}</h2>
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
              <button
                className="fav-btn"
                onClick={() => navigate(`/movies/${detailsModal.data.id}`)}
              >
                Open page
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
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-movie-title"
          >
            <form className="add-form" onSubmit={handleEditSubmit}>
              <h2 id="edit-movie-title">Edit Movie</h2>

              <input
                name="title"
                placeholder="Title"
                value={editValues.title}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                required
              />
              {renderEditError("title")}

              <input
                name="genre"
                placeholder="Genre"
                list="genre-options"
                value={editValues.genre}
                onChange={handleEditChange}
                onBlur={handleEditBlur}
                required
              />
              {renderEditError("genre")}

              <div className="form-row">
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
      <datalist id="genre-options">
        {genreSuggestions.map((genre) => (
          <option key={genre} value={genre} />
        ))}
      </datalist>
    </div>
  );
};

export default MoviesPage;
