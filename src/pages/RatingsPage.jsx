import React, { Suspense, lazy, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MovieContext } from "../MovieContext";

const LazyRatingsContent = lazy(
  () => import("../components/LazyRatingsContent"),
);

const RatingsPage = () => {
  const { movies } = useContext(MovieContext);
  const navigate = useNavigate();

  return (
    <div className="page">
      <h1>Top Ratings</h1>
      <Suspense fallback={<p>Loading ratings...</p>}>
        <LazyRatingsContent
          movies={movies}
          onOpenDetails={(movieId) => navigate(`/movies/${movieId}`)}
        />
      </Suspense>
    </div>
  );
};

export default RatingsPage;
