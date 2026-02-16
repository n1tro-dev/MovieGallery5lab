import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { MovieContext } from "./MovieContext";
import { MovieProvider } from "./MovieProvider";
import Home from "./pages/Home";
import MoviesPage from "./pages/MoviesPage";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <MovieProvider>
      <BrowserRouter>
        <nav className="navbar">
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
          <NavLink to="/movies" className={({ isActive }) => isActive ? "active" : ""}>Gallery</NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </MovieProvider>
  );
}
export default App;