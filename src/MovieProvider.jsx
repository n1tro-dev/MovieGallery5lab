import React, { useState, useEffect, useCallback, useMemo } from "react";
import { MovieContext } from "./MovieContext";
import { useFetch } from "./hooks/useFetch";
import { DEFAULT_MOVIES, fetchMoviesFromApi } from "./services/movieApi";

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

  const [deletedMovieIds, setDeletedMovieIds] = useState(() => {
    const saved = localStorage.getItem("my_deleted_movies");
    return saved ? JSON.parse(saved) : [];
  });

  const getApiMovies = useCallback(() => fetchMoviesFromApi(), []);

  const {
    data: apiMovies = [],
    loading: apiLoading,
    error: apiError,
    refetch: refetchMovies,
  } = useFetch(getApiMovies, { initialData: [] });

  const movies = useMemo(() => {
    const merged = [...apiMovies, ...localMovies];

    return merged.filter((movie) => !deletedMovieIds.includes(movie.id));
  }, [apiMovies, localMovies, deletedMovieIds]);

  useEffect(() => {
    localStorage.setItem("my_local_movies", JSON.stringify(localMovies));
  }, [localMovies]);

  useEffect(() => {
    localStorage.setItem("my_favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("my_deleted_movies", JSON.stringify(deletedMovieIds));
  }, [deletedMovieIds]);

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, []);

  const addMovie = useCallback((m) => {
    setLocalMovies((prev) => [
      ...prev,
      {
        ...m,
        id: Date.now(),
        year: Number(m.year),
        rating: Number(m.rating),
      },
    ]);
  }, []);

  const deleteMovie = useCallback((id) => {
    setLocalMovies((prev) => prev.filter((m) => m.id !== id));
    setDeletedMovieIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setFavorites((prev) => prev.filter((movieId) => movieId !== id));
  }, []);


  const value = useMemo(
    () => ({
      movies,
      favorites,
      apiLoading,
      apiError,
      toggleFavorite,
      addMovie,
      deleteMovie,
      refetchMovies,
    }),
    [
      movies,
      favorites,
      apiLoading,
      apiError,
      toggleFavorite,
      addMovie,
      deleteMovie,
      refetchMovies,
    ],
  );

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
