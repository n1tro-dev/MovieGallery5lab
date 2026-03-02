import React, { useContext } from "react";
import { MovieContext } from "../MovieContext";

const Profile = () => {
  const { movies, favorites } = useContext(MovieContext);

  return (
    <div className="page">
      <h1>User Profile</h1>
      <div className="stats-container">
        <div className="stat-card">
          <h3>Total Movies</h3>
          <p>{movies.length}</p>
        </div>
        <div className="stat-card">
          <h3>Favorites</h3>
          <p>{favorites.length}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;