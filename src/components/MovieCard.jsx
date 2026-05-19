"use client";

import { addExclusion } from '@/app/actions/userExclusions';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function MovieCard({ movie, showExclude = false }) {
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/121826/ffffff?text=No+Poster';

  const handleExclude = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addExclusion(movie.id);
    } catch (err) {
      console.error("Failed to exclude movie:", err);
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative block rounded-xl bg-cinema-surface overflow-hidden border border-white/5 shadow-xl shadow-black/20"
    >
      <Link href={`/movie/${movie.id}`} className="block relative w-full aspect-[2/3]">
        <img 
          src={posterUrl} 
          alt={movie.title || movie.movie_title} 
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />
        {/* Darkening Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-95" />
        
        {/* Content Container */}
        <div className="absolute bottom-0 left-0 w-full p-4 flex flex-col justify-end">
          <h3 className="text-sm md:text-lg font-heading font-bold text-white line-clamp-2 leading-tight drop-shadow-md">
            {movie.title || movie.movie_title}
          </h3>
          
          {/* Animated extra details on hover */}
          <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
            <div className="overflow-hidden">
              <div className="mt-2 space-y-2 pt-1">
                {movie.release_date && (
                  <p className="text-[10px] md:text-xs font-medium text-slate-300">{new Date(movie.release_date).getFullYear()}</p>
                )}
                
                {movie.rating && (
                  <div className="flex items-center gap-2">
                    <span className="bg-cinema-red text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg shadow-cinema-red/20">
                      ★ {Number(movie.rating).toFixed(1)}/10
                    </span>
                  </div>
                )}
                
                {movie.reviewer_name && (
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Reviewed by <span className="text-slate-200">{movie.reviewer_name}</span>
                  </p>
                )}

                {movie.reasoning && (
                  <p className="text-[11px] text-slate-300 line-clamp-3 italic leading-relaxed pt-2 border-t border-white/10 mt-2">
                    "{movie.reasoning}"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* Exclusion Button (X) */}
      <button 
        onClick={handleExclude}
        className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-white/50 hover:text-white hover:bg-cinema-red hover:border-cinema-red hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-20"
        title="Not Interested"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}
