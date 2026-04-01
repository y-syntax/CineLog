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
  // To get a mix of "Classics" and "Surprises":
  // We'll pick a random page from the first 500 pages of discovery
  const randomPage = Math.floor(Math.random() * 500) + 1;
  const sortOptions = ["popularity.desc", "revenue.desc", "vote_average.desc", "primary_release_date.desc"];
  const randomSort = sortOptions[Math.floor(Math.random() * sortOptions.length)];

  const res = await fetch(
    `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&page=${randomPage}&sort_by=${randomSort}&include_adult=false`
  );
  
  if (!res.ok) throw new Error("Failed to fetch discovery movies");
  const data = await res.json();
  
  // Shuffle the results for extra "freshness"
  return data.results.sort(() => Math.random() - 0.5);
}
