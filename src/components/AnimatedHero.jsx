"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AnimatedHero({ featuredReview, defaultBackdrop = "https://image.tmdb.org/t/p/original/tE1tGHpbX2x6S3b0rV0uI455V1d.jpg" }) {
  const backdropUrl = featuredReview?.poster_path 
    ? `https://image.tmdb.org/t/p/original${featuredReview.poster_path.replace('/w500', '')}` // Try to use the original quality if poster is given, though backdrop is better if we had it.
    : defaultBackdrop;

  // Ideally, TMDB API would give us backdrop_path, but if we only have poster_path we can use that, or a default cinematic backdrop.

  return (
    <div className="relative w-full h-[75vh] md:h-[85vh] min-h-[600px] flex items-end justify-center overflow-hidden">
      {/* Background Image with Slow Zoom */}
      <motion.div
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 15, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat opacity-60"
          style={{ backgroundImage: `url(${defaultBackdrop})` }}
        />
      </motion.div>

      {/* Gradient Overlays for readability and fading into the rest of the site */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-cinema-dark via-cinema-dark/60 to-transparent" />
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-cinema-dark/80 via-transparent to-transparent" />

      {/* Hero Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-20 md:pb-32 flex flex-col md:flex-row items-end justify-between gap-10">
        
        {/* Main Branding / Tagline */}
        <div className="flex-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-black tracking-tight leading-tight text-white drop-shadow-lg">
              Your Cinematic <br/>
              <span className="text-cinema-red">Universe.</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl text-slate-300 font-medium max-w-lg drop-shadow">
              Log your journey, discover masterpieces, and immerse yourself in a community built by film nerds with taste.
            </p>
          </motion.div>
        </div>

        {/* Featured Review Card (if available) */}
        {featuredReview && (
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            className="w-full md:w-[400px] glass rounded-2xl p-6 border border-white/10 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-cinema-red" />
            <h3 className="text-xs font-bold text-cinema-red uppercase tracking-widest mb-3">Featured Review</h3>
            
            <h4 className="text-2xl font-heading font-bold text-white mb-1 line-clamp-1">
              {featuredReview.movie_title}
            </h4>
            
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-cinema-red/20 text-cinema-red text-xs font-bold px-2 py-0.5 rounded border border-cinema-red/30">
                ★ {Number(featuredReview.rating).toFixed(1)}/10
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                By {featuredReview.reviewer_name}
              </span>
            </div>

            <p className="text-sm text-slate-300 italic line-clamp-3 mb-6">
              "{featuredReview.review_text}"
            </p>

            <Link 
              href={`/movie/${featuredReview.movie_id}`}
              className="inline-flex items-center justify-center w-full py-3 bg-white text-black hover:bg-cinema-red hover:text-white font-bold rounded-xl transition-all shadow-lg"
            >
              Read Review
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
}
