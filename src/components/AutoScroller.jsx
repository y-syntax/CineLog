"use client";

import MovieCard from "./MovieCard";
import { useState } from "react";

export default function AutoScroller({ movies }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative w-full overflow-hidden py-10 my-4 group">
      {/* Deep Cinematic Vignette Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-64 bg-gradient-to-l from-slate-950 via-slate-950/40 to-transparent z-10 pointer-events-none" />

      {/* Parent flex container with gap-6 */}
      <div className="flex gap-6 w-max">
        {/* Track 1 */}
        <div 
          className={`flex gap-6 shrink-0 animate-marquee ${isHovered ? 'pause-animation' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {movies.map((movie, idx) => (
            <div key={`${movie.id}-track1-${idx}`} className="w-[180px] md:w-[240px] flex-shrink-0 transition-transform hover:scale-105 duration-300">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
        
        {/* Track 2 (Identical Copy for seamless scrolling loop) */}
        <div 
          className={`flex gap-6 shrink-0 animate-marquee ${isHovered ? 'pause-animation' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-hidden="true"
        >
          {movies.map((movie, idx) => (
            <div key={`${movie.id}-track2-${idx}`} className="w-[180px] md:w-[240px] flex-shrink-0 transition-transform hover:scale-105 duration-300">
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
