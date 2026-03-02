import React from "react";

const MovieCard = React.memo(({ movie, isFavorite, onToggleFav, onDelete, onOpen }) => {
  return (
    <div className="card" onClick={() => onOpen(movie)}>
      <img src={movie.poster} alt={movie.title} />
      <h3>{movie.title}</h3>
      <p>{movie.year} | ⭐ {movie.rating}</p>
      
      <div className="card-btns">
        {/* Используем классы из твоего CSS */}
        <button 
          className={`fav-btn ${isFavorite ? "active" : ""}`} 
          onClick={(e) => { e.stopPropagation(); onToggleFav(movie.id); }}
        >
          {isFavorite ? "❤️ В избранном" : "🤍 В избранное"}
        </button>
        <button 
          className="fav-btn" 
          style={{borderColor: "red", color: "red"}} 
          onClick={(e) => { e.stopPropagation(); onDelete(movie.id); }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
});

export default MovieCard;