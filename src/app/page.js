"use client";

import { useState } from 'react';
import { searchMovies } from '@/app/actions/movieApi';
import MovieCard from '@/components/MovieCard';

export default function HomePage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await searchMovies(query);
      setMovies(results || []);
    } catch (err) {
      setError(err.message || 'Failed to search movies. Check API Keys.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-16 fade-in">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-8 pt-10">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight pb-2">
          Discover your next <br className="hidden md:block"/>
          <span className="gradient-text">masterpiece</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto">
          Search the cinematic universe, log personal reviews, and let AI reveal your perfect viewing vibe.
        </p>
        
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mt-12 group z-10">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 rounded-2xl blur-md opacity-25 group-hover:opacity-60 transition duration-1000 group-hover:duration-300"></div>
          <div className="relative flex items-center bg-slate-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all group-hover:border-white/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-6 h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for a movie (e.g. Inception, The Matrix)..." 
              className="w-full bg-transparent pl-16 pr-6 py-5 text-lg text-white focus:outline-none placeholder-slate-500 tracking-wide"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white transition-all disabled:opacity-50 disabled:grayscale flex-shrink-0"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
                  Searching...
                </span>
              ) : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-5 rounded-2xl text-center max-w-2xl mx-auto font-medium">
          {error}
        </div>
      )}

      {/* Results Grid */}
      {movies.length > 0 && (
        <div className="fade-in">
          <h2 className="text-2xl font-bold mb-8 text-slate-200">Search Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
