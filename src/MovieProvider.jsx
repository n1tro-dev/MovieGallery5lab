import React, { useState, useCallback, useMemo } from "react";
import { MovieContext } from "./MovieContext";

export const MovieProvider = ({ children }) => {
  const [movies, setMovies] = useState([
    {
      id: 1,
      title: "Inception",
      genre: "Sci-Fi",
      rating: 8.8,
      year: 2010,
      description: "Dream within a dream.",
      poster:
        "https://static.kinoafisha.info/k/movie_posters/1920x1080/upload/movie_posters/8/0/0/7794008/286676351653465386.jpg",
    },
    {
      id: 2,
      title: "The Dark Knight",
      genre: "Action",
      rating: 9.0,
      year: 2008,
      description: "Batman vs Joker.",
      poster:
        "https://avatars.mds.yandex.net/get-mpic/4408567/2a000001919dc17b6bfee339046e8a264aa8/orig",
    },
    {
      id: 3,
      title: "Interstellar",
      genre: "Sci-Fi",
      rating: 8.6,
      year: 2014,
      description: "Space exploration.",
      poster:
        "https://basket-20.wbbasket.ru/vol3475/part347511/347511643/images/big/1.webp",
    },
    {
      id: 4,
      title: "The Matrix",
      genre: "Action",
      rating: 8.7,
      year: 1999,
      description:
        "A computer hacker learns from mysterious rebels about the true nature of his reality.",
      poster: "https://m.media-amazon.com/images/I/51EG732BV3L._AC_.jpg",
    },
    {
      id: 5,
      title: "Pulp Fiction",
      genre: "Crime",
      rating: 8.9,
      year: 1994,
      description:
        "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence.",
      poster: "https://m.media-amazon.com/images/I/71c05lTE03L._AC_SY679_.jpg",
    },
    {
      id: 6,
      title: "The Lion King",
      genre: "Animation",
      rating: 8.5,
      year: 1994,
      description:
        "Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne.",
      poster:
        "https://api.slonum.ru/service-files/static/image/f270df63-9fdf-4369-87a1-d86498dd4548.jpg",
    },
    {
      id: 7,
      title: "The Shawshank Redemption",
      genre: "Drama",
      rating: 9.3,
      year: 1994,
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster: "https://m.media-amazon.com/images/I/519NBNHX5BL._AC_.jpg",
    },
    {
      id: 8,
      title: "Gladiator",
      genre: "Action",
      rating: 8.5,
      year: 2000,
      description:
        "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family.",
      poster: "https://www.kino-teatr.ru/movie/poster/30220/49944.jpg",
    },
  ]);

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("my_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = useCallback((id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  }, []);

  const addMovie = useCallback((m) => {
    setMovies(prev => [...prev, { ...m, id: Date.now() }]);
  }, []);

  const deleteMovie = useCallback((id) => {
    setMovies(prev => prev.filter(m => m.id !== id));
  }, []);

  // Оптимизация провайдера (Задача №11)
  const value = useMemo(() => ({
    movies, favorites, toggleFavorite, addMovie, deleteMovie
  }), [movies, favorites, toggleFavorite, addMovie, deleteMovie]);

  return <MovieContext.Provider value={value}>{children}</MovieContext.Provider>;
};