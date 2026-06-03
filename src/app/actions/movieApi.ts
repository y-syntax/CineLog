"use server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function searchMovies(query: string) {
  if (!query) return [];
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`
  );
  if (!res.ok) throw new Error("Failed to fetch movies");
  const data = await res.json();
  return data.results;
}

export async function getMovieDetails(id: string | number) {
  const res = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  const data = await res.json();
  return data;
}

export async function getDiscoveryMovies() {
  // Fetch popular movies to avoid obscure titles. Select a random page 1-5 for fresh variety.
  const randomPage = Math.floor(Math.random() * 5) + 1;

  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${randomPage}&sort_by=popularity.desc&vote_count.gte=200&include_adult=false`
  );
  
  if (!res.ok) throw new Error("Failed to fetch discovery movies");
  const data = await res.json();
  
  // Shuffle the results for extra "freshness"
  return data.results.sort(() => Math.random() - 0.5);
}
