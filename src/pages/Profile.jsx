import React, { useContext } from "react";
import { MovieContext } from "../MovieContext";

const Profile = () => {
  const { movies, favorites, isAuthenticated, login, logout } =
    useContext(MovieContext);

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

      <div style={{ marginTop: "16px" }}>
        <p>Status: {isAuthenticated ? "Authorized" : "Not authorized"}</p>
        {isAuthenticated ? (
          <button type="button" onClick={logout}>
            Logout
          </button>
        ) : (
          <button type="button" onClick={login}>
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
