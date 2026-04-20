import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MovieContext } from "./MovieContext";
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

  const addMovie = useCallback(async (m) => {
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
      return createdMovie;
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error("Failed to create movie");
      setMutationError(nextError);
      throw nextError;
    } finally {
      setCreatingMovie(false);
    }
  }, []);

  const deleteMovie = useCallback(async (id) => {
    setDeletingMovieId(id);
    setMutationError(null);

    try {
      await deleteMovieOnApi(id);

      setLocalMovies((prev) => prev.filter((m) => m.id !== id));
      setDeletedMovieIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      setFavorites((prev) => prev.filter((movieId) => movieId !== id));
      setMovieOverrides((prev) => {
        if (!prev[id]) {
          return prev;
        }

        const next = { ...prev };
        delete next[id];
        return next;
      });
      return true;
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error("Failed to delete movie");
      setMutationError(nextError);
      throw nextError;
    } finally {
      setDeletingMovieId(null);
    }
  }, []);

  const updateMovie = useCallback(async (movie) => {
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
              item.id === updatedMovie.id ? { ...item, ...updatedMovie } : item,
            )
          : prev,
      );

      setMovieOverrides((prev) => ({
        ...prev,
        [updatedMovie.id]: updatedMovie,
      }));

      return updatedMovie;
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error("Failed to update movie");
      setUpdateError(nextError);
      throw nextError;
    } finally {
      setUpdatingMovieId(null);
    }
  }, []);

  const login = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
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

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
