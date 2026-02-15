import React, { useState, useEffect } from "react";

const INITIAL_MOVIES = [
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
];

function App() {
  const [movies] = useState(INITIAL_MOVIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); // Для модалки

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("my_favorites");
    return saved ? JSON.parse(saved) : [];
  });
  const allGenres = movies.map((movie) => movie.genre);
  // Set — это объект в JavaScript, который хранит только неповторяющиеся значения
  const uniqueGenres = [...new Set(allGenres)];
  const categories = ["All", ...uniqueGenres];

  // 3. Эффект для сохранения "Избранного" при каждом изменении
  useEffect(() => {
    localStorage.setItem("my_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || movie.genre === selectedGenre;

      const matchesFavorite = showOnlyFavorites
        ? favorites.includes(movie.id)
        : true;

      return matchesSearch && matchesGenre && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  return (
    <div className="app">
      <h1>Movie Gallery</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* <select onChange={(e) => setSelectedGenre(e.target.value)}>
          <option value="All">All Genres</option>
          <option value="Sci-Fi">Sci-Fi</option>
          <option value="Action">Action</option>
        </select> */}
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
        >
          {categories.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button
          onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={{ backgroundColor: showOnlyFavorites ? "#646cff" : "" }}
        >
          {showOnlyFavorites
            ? "❤️ Showing Favorites"
            : `🤍 Favorites (${favorites.length})`}
        </button>
      </div>

      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div
            key={movie.id}
            className="card"
            onClick={() => setSelectedMovie(movie)}
          >
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>Rating: {movie.rating}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Чтобы не открылась модалка
                toggleFavorite(movie.id);
              }}
            >
              {favorites.includes(movie.id)
                ? "❤️ In Favorites"
                : "🤍 Add to Favorites"}
            </button>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p>
              <strong>Genre:</strong> {selectedMovie.genre} <br />
              <strong>Year:</strong> {selectedMovie.year} <br />
              <strong>Rating:</strong> {selectedMovie.rating} <br />
            </p>
            <p>{selectedMovie.description}</p>
            <button onClick={() => setSelectedMovie(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
