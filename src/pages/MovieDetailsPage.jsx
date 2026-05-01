import React, { useContext, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { MovieContext } from "../MovieContext";

const MovieDetailsPage = () => {
  const { id } = useParams();
  const { movies } = useContext(MovieContext);

  const movie = useMemo(
    () => movies.find((item) => String(item.id) === String(id)),
    [movies, id],
  );

  if (!movie) {
    return (
      <div className="page">
        <h1>Movie not found</h1>
        <Link to="/movies">Back to gallery</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} style={{ maxWidth: "320px" }} />
      <p>
        <strong>Genre:</strong> {movie.genre}
      </p>
      <p>
        <strong>Year:</strong> {movie.year}
      </p>
      <p>
        <strong>Rating:</strong> {movie.rating}
      </p>
      <p>{movie.description}</p>
      <Link to="/movies" className="btn btn-ghost btn-link">
        Back to gallery
      </Link>
    </div>
  );
};

export default MovieDetailsPage;
