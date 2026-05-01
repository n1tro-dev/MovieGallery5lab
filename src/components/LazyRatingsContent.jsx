import React from "react";
import MovieListRenderProps from "./MovieListRenderProps";
import CompoundMovieCard from "./CompoundMovieCard";

const LazyRatingsContent = ({ movies, onOpenDetails }) => {
  return (
    <MovieListRenderProps items={movies}>
      {({ items }) => (
        <div className="movie-grid">
          {items.map((movie) => (
            <CompoundMovieCard key={movie.id} movie={movie}>
              <CompoundMovieCard.Header />
              <CompoundMovieCard.Body />
              <CompoundMovieCard.Footer onOpenDetails={onOpenDetails} />
            </CompoundMovieCard>
          ))}
        </div>
      )}
    </MovieListRenderProps>
  );
};

export default LazyRatingsContent;
