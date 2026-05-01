import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  MovieContext,
  MovieFilterContext,
  MovieNotificationContext,
} from "./MovieContext";
import { useFetch } from "./hooks/useFetch";
import {
  DEFAULT_MOVIES,
  createMovieOnApi,
  deleteMovieOnApi,
  fetchMoviesFromApi,
  updateMovieOnApi,
} from "./services/movieApi";

export const MovieProvider = ({ children }) => {
  const [localMovies, setLocalMovies] = useState(() => {
    const savedLocalMovies = localStorage.getItem("my_local_movies");
    const legacyMovies = localStorage.getItem("my_movies");
    const initial = savedLocalMovies || legacyMovies;

    return initial ? JSON.parse(initial) : DEFAULT_MOVIES;
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("my_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const saved = localStorage.getItem("my_is_authenticated");
    return saved ? JSON.parse(saved) : false;
  });

  const [deletedMovieIds, setDeletedMovieIds] = useState(() => {
    const saved = localStorage.getItem("my_deleted_movies");
    return saved ? JSON.parse(saved) : [];
  });

  const [movieOverrides, setMovieOverrides] = useState(() => {
    const saved = localStorage.getItem("my_movie_overrides");
    return saved ? JSON.parse(saved) : {};
  });

  const [updatingMovieId, setUpdatingMovieId] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [creatingMovie, setCreatingMovie] = useState(false);
  const [deletingMovieId, setDeletingMovieId] = useState(null);
  const [mutationError, setMutationError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);

  const [notification, setNotification] = useState(null);

  const showSuccess = useCallback((message) => {
    setNotification({ type: "success", message });
  }, []);

  const showError = useCallback((message) => {
    setNotification({ type: "error", message });
  }, []);

  const clearNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const getApiMovies = useCallback(() => fetchMoviesFromApi(), []);

  const {
    data: apiMovies = [],
    loading: apiLoading,
    error: apiError,
    refetch: refetchMovies,
  } = useFetch(getApiMovies, { initialData: [] });

  const movies = useMemo(() => {
    const merged = [...apiMovies, ...localMovies]
      .filter((movie) => !deletedMovieIds.includes(movie.id))
      .map((movie) => ({
        ...movie,
        ...(movieOverrides[movie.id] || {}),
      }));

    return merged;
  }, [apiMovies, localMovies, deletedMovieIds, movieOverrides]);

  useEffect(() => {
    localStorage.setItem("my_local_movies", JSON.stringify(localMovies));
  }, [localMovies]);

  useEffect(() => {
    localStorage.setItem("my_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      "my_is_authenticated",
      JSON.stringify(isAuthenticated),
    );
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem("my_deleted_movies", JSON.stringify(deletedMovieIds));
  }, [deletedMovieIds]);

  useEffect(() => {
    localStorage.setItem("my_movie_overrides", JSON.stringify(movieOverrides));
  }, [movieOverrides]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const addMovie = useCallback(
    async (m) => {
      const normalizedMovie = {
        ...m,
        year: Number(m.year),
        rating: Number(m.rating),
      };

      setCreatingMovie(true);
      setMutationError(null);

      try {
        const createdMovie = await createMovieOnApi(normalizedMovie);

        setLocalMovies((prev) => [...prev, createdMovie]);
        showSuccess("Фильм успешно добавлен");
        return createdMovie;
      } catch (err) {
        const nextError =
          err instanceof Error ? err : new Error("Failed to create movie");
        setMutationError(nextError);
        showError(nextError.message);
        throw nextError;
      } finally {
        setCreatingMovie(false);
      }
    },
    [showError, showSuccess],
  );

  const deleteMovie = useCallback(
    async (id) => {
      setDeletingMovieId(id);
      setMutationError(null);

      try {
        await deleteMovieOnApi(id);

        setLocalMovies((prev) => prev.filter((m) => m.id !== id));
        setDeletedMovieIds((prev) =>
          prev.includes(id) ? prev : [...prev, id],
        );
        setFavorites((prev) => prev.filter((movieId) => movieId !== id));
        setMovieOverrides((prev) => {
          if (!prev[id]) {
            return prev;
          }

          const next = { ...prev };
          delete next[id];
          return next;
        });
        showSuccess("Фильм удален");
        return true;
      } catch (err) {
        const nextError =
          err instanceof Error ? err : new Error("Failed to delete movie");
        setMutationError(nextError);
        showError(nextError.message);
        throw nextError;
      } finally {
        setDeletingMovieId(null);
      }
    },
    [showError, showSuccess],
  );

  const updateMovie = useCallback(
    async (movie) => {
      const normalizedMovie = {
        ...movie,
        id: Number(movie.id),
        year: Number(movie.year),
        rating: Number(movie.rating),
      };

      setUpdatingMovieId(normalizedMovie.id);
      setUpdateError(null);

      try {
        const updatedMovie = await updateMovieOnApi(
          normalizedMovie.id,
          normalizedMovie,
        );

        setLocalMovies((prev) =>
          prev.some((item) => item.id === updatedMovie.id)
            ? prev.map((item) =>
                item.id === updatedMovie.id
                  ? { ...item, ...updatedMovie }
                  : item,
              )
            : prev,
        );

        setMovieOverrides((prev) => ({
          ...prev,
          [updatedMovie.id]: updatedMovie,
        }));

        showSuccess("Изменения сохранены");
        return updatedMovie;
      } catch (err) {
        const nextError =
          err instanceof Error ? err : new Error("Failed to update movie");
        setUpdateError(nextError);
        showError(nextError.message);
        throw nextError;
      } finally {
        setUpdatingMovieId(null);
      }
    },
    [showError, showSuccess],
  );

  const login = useCallback(() => {
    setIsAuthenticated(true);
    showSuccess("Вы вошли в аккаунт");
  }, [showSuccess]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    showSuccess("Вы вышли из аккаунта");
  }, [showSuccess]);

  const dataValue = useMemo(
    () => ({
      movies,
      favorites,
      isAuthenticated,
      apiLoading,
      apiError,
      updateError,
      mutationError,
      creatingMovie,
      deletingMovieId,
      updatingMovieId,
      toggleFavorite,
      addMovie,
      deleteMovie,
      updateMovie,
      login,
      logout,
      refetchMovies,
    }),
    [
      movies,
      favorites,
      isAuthenticated,
      apiLoading,
      apiError,
      updateError,
      mutationError,
      creatingMovie,
      deletingMovieId,
      updatingMovieId,
      toggleFavorite,
      addMovie,
      deleteMovie,
      updateMovie,
      login,
      logout,
      refetchMovies,
    ],
  );

  const filterValue = useMemo(
    () => ({
      searchTerm,
      selectedGenre,
      sortBy,
      currentPage,
      setSearchTerm,
      setSelectedGenre,
      setSortBy,
      setCurrentPage,
    }),
    [searchTerm, selectedGenre, sortBy, currentPage],
  );

  const notificationValue = useMemo(
    () => ({
      notification,
      showSuccess,
      showError,
      clearNotification,
    }),
    [notification, showSuccess, showError, clearNotification],
  );

  const legacyValue = useMemo(
    () => ({
      ...dataValue,
      ...filterValue,
      ...notificationValue,
    }),
    [dataValue, filterValue, notificationValue],
  );

  return (
    <MovieContext.Provider value={legacyValue}>
      <MovieFilterContext.Provider value={filterValue}>
        <MovieNotificationContext.Provider value={notificationValue}>
          {children}
        </MovieNotificationContext.Provider>
      </MovieFilterContext.Provider>
    </MovieContext.Provider>
  );
};
