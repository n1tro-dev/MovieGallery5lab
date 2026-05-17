const TVMAZE_URL = "https://api.tvmaze.com/shows?page=1";
const MOVIE_UPDATE_URL = "https://jsonplaceholder.typicode.com/posts";
const MOVIE_CREATE_URL = "https://jsonplaceholder.typicode.com/posts";
const MOVIE_DELETE_URL = "https://jsonplaceholder.typicode.com/posts";

const normalizeShowToMovie = (show) => {
  const genres = Array.isArray(show.genres) ? show.genres : [];

  return {
    id: Number(show.id),
    title: show.name || "Untitled",
    genre: genres[0] || "Unknown",
    rating: Number(show.rating?.average ?? 0),
    year: show.premiered ? Number(show.premiered.slice(0, 4)) : 2000,
    description: (show.summary || "No description").replace(/<[^>]*>/g, ""),
    poster: show.image?.original || show.image?.medium || "",
  };
};

export const fetchMoviesFromApi = async () => {
  const response = await fetch(TVMAZE_URL);

  if (!response.ok) {
    throw new Error("Failed to load movies from API");
  }

  const data = await response.json();

  return data
    .map(normalizeShowToMovie)
    .filter((movie) => movie.poster)
    .slice(0, 24);
};

export const updateMovieOnApi = async (movieId, moviePayload) => {
  const response = await fetch(`${MOVIE_UPDATE_URL}/${movieId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) {
    throw new Error("Failed to update movie through API");
  }

  const data = await response.json();

  return {
    ...moviePayload,
    id: Number(data.id ?? movieId),
  };
};

export const createMovieOnApi = async (moviePayload) => {
  const response = await fetch(MOVIE_CREATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(moviePayload),
  });

  if (!response.ok) {
    throw new Error("Failed to create movie through API");
  }

  const data = await response.json();

  return {
    ...moviePayload,
    id: Number(data.id ?? Date.now()),
  };
};

export const deleteMovieOnApi = async (movieId) => {
  const response = await fetch(`${MOVIE_DELETE_URL}/${movieId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete movie through API");
  }

  return true;
};
