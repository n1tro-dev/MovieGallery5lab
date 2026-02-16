import React, { useContext, useState } from "react";
import { MovieContext } from "../MovieContext";

const MoviesPage = () => {
  const { movies, favorites, toggleFavorite, addMovie, deleteMovie } = useContext(MovieContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("title");

  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); 

  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    rating: "",
    poster: "",
    year: "",
    description: ""
  });

  const uniqueGenres = ["All", ...new Set(movies.map((m) => m.genre))];

  const filteredMovies = movies
    .filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = selectedGenre === "All" || movie.genre === selectedGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      return a.title.localeCompare(b.title);
    });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newMovie.title || !newMovie.genre) return alert("Заполните название и жанр!");

    addMovie({
      ...newMovie,
      rating: Number(newMovie.rating) || 0,
      year: Number(newMovie.year) || new Date().getFullYear(),
    });

    setNewMovie({ title: "", genre: "", rating: "", poster: "", year: "", description: "" });
    setIsAddModalOpen(false);
  };

  return (
    <div className="page">
      <h1>Movie Gallery</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search movies..."
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>{genre}</option>
          ))}
        </select>
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="title">Sort by Name</option>
          <option value="rating">Sort by Rating</option>
        </select>

        <button 
          onClick={() => setIsAddModalOpen(true)}
          style={{ backgroundColor: "var(--accent)", color: "white", fontWeight: "bold" }}
        >
          + Add New Movie
        </button>
      </div>

      {/* СЕТКА КАРТОЧЕК */}
      <div className="movie-grid">
        {filteredMovies.map((movie) => (
          <div key={movie.id} className="card" onClick={() => setSelectedMovie(movie)}>
            <img src={movie.poster} alt={movie.title} />
            <h3>{movie.title}</h3>
            <p>{movie.year} | ⭐ {movie.rating}</p>
            
            <div className="card-btns">
              <button className="btn-fav" onClick={(e) => { e.stopPropagation(); toggleFavorite(movie.id); }}>
                {favorites.includes(movie.id) ? "❤️" : "🤍"}
              </button>
              <button className="btn-del" onClick={(e) => { e.stopPropagation(); deleteMovie(movie.id); }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* МОДАЛКА: ФОРМА ДОБАВЛЕНИЯ (Задача №2) */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <form className="add-form" onSubmit={handleAddSubmit} style={{ border: "none", padding: 0, margin: 0 }}>
              <h2>Add New Movie</h2>
              <input 
                type="text" placeholder="Movie Title" required
                value={newMovie.title} onChange={(e) => setNewMovie({...newMovie, title: e.target.value})} 
              />
              <input 
                type="text" placeholder="Genre" required
                value={newMovie.genre} onChange={(e) => setNewMovie({...newMovie, genre: e.target.value})} 
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <input 
                  type="number" placeholder="Year" style={{ flex: 1 }}
                  value={newMovie.year} onChange={(e) => setNewMovie({...newMovie, year: e.target.value})} 
                />
                <input 
                  type="number" step="0.1" placeholder="Rating" style={{ flex: 1 }}
                  value={newMovie.rating} onChange={(e) => setNewMovie({...newMovie, rating: e.target.value})} 
                />
              </div>
              <input 
                type="text" placeholder="Poster URL" 
                value={newMovie.poster} onChange={(e) => setNewMovie({...newMovie, poster: e.target.value})} 
              />
              <textarea 
                placeholder="Description" rows="4"
                value={newMovie.description} onChange={(e) => setNewMovie({...newMovie, description: e.target.value})} 
                style={{padding: "10px", borderRadius: "8px", background: "var(--bg-app)", color: "white", border: "1px solid var(--border)" }}
              />
              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button type="submit" style={{ flex: 1, backgroundColor: "var(--accent)", color: "white" }}>Create</button>
                <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* МОДАЛКА */}
      {selectedMovie && (
        <div className="modal-overlay" onClick={() => setSelectedMovie(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedMovie.poster} alt="" style={{ width: "100%", borderRadius: "10px", marginBottom: "15px" }} />
            <h2>{selectedMovie.title} ({selectedMovie.year})</h2>
            <p><strong>Genre:</strong> {selectedMovie.genre} | <strong>Rating:</strong> ⭐ {selectedMovie.rating}</p>
            <p style={{ lineHeight: "1.6", opacity: 0.9 }}>{selectedMovie.description}</p>
            <button onClick={() => setSelectedMovie(null)} style={{ width: "100%", marginTop: "15px" }}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviesPage;