import React, { createContext, useContext, useMemo, useState } from "react";

const CompoundMovieCardContext = createContext(null);

const useCompoundMovieCard = () => {
  const context = useContext(CompoundMovieCardContext);

  if (!context) {
    throw new Error(
      "CompoundMovieCard subcomponents must be used inside CompoundMovieCard",
    );
  }

  return context;
};

const CompoundMovieCardRoot = ({ movie, children }) => {
  const [watched, setWatched] = useState(false);

  const value = useMemo(
    () => ({
      movie,
      watched,
      toggleWatched: () => setWatched((prev) => !prev),
    }),
    [movie, watched],
  );

  return (
    <CompoundMovieCardContext.Provider value={value}>
      <div className="card">{children}</div>
    </CompoundMovieCardContext.Provider>
  );
};

const Header = () => {
  const { movie } = useCompoundMovieCard();
  return <h3>{movie.title}</h3>;
};

const Body = () => {
  const { movie } = useCompoundMovieCard();
  return (
    <p>
      {movie.year} | ⭐ {movie.rating} | {movie.genre}
    </p>
  );
};

const Footer = ({ onOpenDetails }) => {
  const { movie, watched, toggleWatched } = useCompoundMovieCard();

  return (
    <div className="card-btns">
      <button className="fav-btn" onClick={toggleWatched}>
        {watched ? "Watched" : "Mark watched"}
      </button>
      <button className="fav-btn" onClick={() => onOpenDetails(movie.id)}>
        Details
      </button>
    </div>
  );
};

const CompoundMovieCard = Object.assign(CompoundMovieCardRoot, {
  Header,
  Body,
  Footer,
});

export default CompoundMovieCard;
