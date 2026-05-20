"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

export default function CommunityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get('sort') || 'latest';
  const currentMin = searchParams.get('min') || 'all';
  const currentGenre = searchParams.get('genre') || 'all';

  const updateFilters = useCallback((name, value) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'all' || value === 'latest') {
      params.delete(name);
    } else {
      params.set(name, value);
    }
    router.push(`/community?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-8">
      {/* Sort By */}
      <div className="flex items-center gap-2 relative">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline-block">Sort:</span>
        <select 
          value={currentSort}
          onChange={(e) => updateFilters('sort', e.target.value)}
          className="bg-black/20 border border-white/10 text-white text-sm font-medium rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-cinema-red focus:outline-none appearance-none cursor-pointer backdrop-blur-md hover:bg-white/5 transition-all shadow-lg"
        >
          <option className="bg-slate-900 text-white" value="latest">Latest Reviews</option>
          <option className="bg-slate-900 text-white" value="rating">Highest Rated</option>
          <option className="bg-slate-900 text-white" value="likes">Most Liked</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          ▼
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2 relative">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline-block">Rating:</span>
        <select 
          value={currentMin}
          onChange={(e) => updateFilters('min', e.target.value)}
          className="bg-black/20 border border-white/10 text-white text-sm font-medium rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-cinema-red focus:outline-none appearance-none cursor-pointer backdrop-blur-md hover:bg-white/5 transition-all shadow-lg"
        >
          <option className="bg-slate-900 text-white" value="all">All Ratings</option>
          <option className="bg-slate-900 text-white" value="8">8+ Masterpieces</option>
          <option className="bg-slate-900 text-white" value="9">9+ Masterpieces</option>
          <option className="bg-slate-900 text-white" value="10">10/10 Perfect</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          ▼
        </div>
      </div>

      {/* Genre */}
      <div className="flex items-center gap-2 relative">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:inline-block">Genre:</span>
        <select 
          value={currentGenre}
          onChange={(e) => updateFilters('genre', e.target.value)}
          className="bg-black/20 border border-white/10 text-white text-sm font-medium rounded-xl pl-4 pr-10 py-2.5 focus:ring-2 focus:ring-cinema-red focus:outline-none appearance-none cursor-pointer backdrop-blur-md hover:bg-white/5 transition-all shadow-lg"
        >
          <option className="bg-slate-900 text-white" value="all">All Genres</option>
          {GENRES.map(g => (
            <option className="bg-slate-900 text-white" key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          ▼
        </div>
      </div>
    </div>
  );
}
