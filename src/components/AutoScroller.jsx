"use client";

import MovieCard from "./MovieCard";
import { useEffect, useRef, useState } from "react";

export default function AutoScroller({ movies }) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // We duplicate the movies array to create a seamless loop
  const duplicatedMovies = [...movies, ...movies];

  return (
    <div className="relative w-full overflow-hidden py-10 my-4 group">
       {/* Soft Vignette Overlays */}
       <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none" />
       <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none" />

       <div 
         className={`flex gap-6 animate-marquee ${isHovered ? 'pause-animation' : ''}`}
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
       >
         {duplicatedMovies.map((movie, idx) => (
           <div key={`${movie.id}-${idx}`} className="w-[180px] md:w-[240px] flex-shrink-0 transition-transform hover:scale-105 duration-300">
             <MovieCard movie={movie} />
           </div>
         ))}
       </div>

       <style jsx>{`
         .animate-marquee {
           display: flex;
           width: max-content;
           animation: marquee 60s linear infinite;
         }
         
         .pause-animation {
           animation-play-state: paused;
         }

         @keyframes marquee {
           0% {
             transform: translateX(0);
           }
           100% {
             transform: translateX(-50%);
           }
         }
       `}</style>
    </div>
  );
}
