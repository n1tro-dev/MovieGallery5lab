import React, { Suspense, lazy } from "react";
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
  return (
    <MovieProvider>
      <BrowserRouter>
        <nav className="navbar">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Gallery
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profile
          </NavLink>
          <NavLink
            to="/ratings"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Ratings
          </NavLink>
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
