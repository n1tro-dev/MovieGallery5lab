import React, { Suspense, lazy, useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { MovieProvider } from "./MovieProvider";
import withAuthProtection from "./hoc/withAuthProtection";

const Home = lazy(() => import("./pages/Home"));
const MoviesPage = lazy(() => import("./pages/MoviesPage"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RatingsPage = lazy(() => import("./pages/RatingsPage"));
const MovieDetailsPage = lazy(() => import("./pages/MovieDetailsPage"));

const ProtectedRatingsPage = withAuthProtection(RatingsPage);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <MovieProvider>
      <BrowserRouter>
        <nav className={`navbar ${isMenuOpen ? "is-open" : ""}`}>
          <button
            type="button"
            className="nav-toggle"
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            onClick={toggleMenu}
          >
            <span />
            <span />
            <span />
          </button>
          <div className="nav-links">
            <NavLink
              to="/"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Home
            </NavLink>
            <NavLink
              to="/movies"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Gallery
            </NavLink>
            <NavLink
              to="/profile"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Profile
            </NavLink>
            <NavLink
              to="/ratings"
              onClick={closeMenu}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              Ratings
            </NavLink>
          </div>
        </nav>

        <Suspense
          fallback={
            <div style={{ color: "var(--accent)", textAlign: "center" }}>
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<MoviesPage />} />
            <Route path="/movies/:id" element={<MovieDetailsPage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/ratings" element={<ProtectedRatingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </MovieProvider>
  );
}

export default App;
