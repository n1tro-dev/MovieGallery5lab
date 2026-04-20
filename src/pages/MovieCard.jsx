import React from "react";

const MovieCard = React.memo(
  ({ movie, isFavorite, onToggleFav, onDelete, onOpen }) => {
    return (
      <div className="card" onClick={() => onOpen(movie)}>
        <img src={movie.poster} alt={movie.title} />
        <h3>{movie.title}</h3>
        <p>
          {movie.year} | ⭐ {movie.rating}
        </p>

        <div className="card-btns">
          <button
            className={`fav-btn ${isFavorite ? "active" : ""}`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            onClick={(e) => {
              e.stopPropagation();
              onToggleFav(movie.id);
            }}
          >
            {isFavorite ? "❤️" : "🤍"}
          </button>
          <button
            className="fav-btn"
            aria-label="Delete movie"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(movie.id);
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    );
  },
);

export default MovieCard;
