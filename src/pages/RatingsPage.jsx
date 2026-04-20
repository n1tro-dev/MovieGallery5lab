import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import MovieListRenderProps from "../components/MovieListRenderProps";
import CompoundMovieCard from "../components/CompoundMovieCard";
import { MovieContext } from "../MovieContext";

const RatingsPage = () => {
  const { movies } = useContext(MovieContext);
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Top Ratings</h1>

      <MovieListRenderProps items={movies}>
        {({ items }) => (
          <div className="movie-grid">
            {items.map((movie) => (
              <CompoundMovieCard key={movie.id} movie={movie}>
                <CompoundMovieCard.Header />
                <CompoundMovieCard.Body />
                <CompoundMovieCard.Footer
                  onOpenDetails={(movieId) => navigate(`/movies/${movieId}`)}
                />
              </CompoundMovieCard>
            ))}
          </div>
        )}
      </MovieListRenderProps>
    </div>
  );
};

export default RatingsPage;
