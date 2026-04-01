export default function MovieCard({ movie }) {
  // TMDB poster paths come as partial URLs
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750/1e293b/ffffff?text=No+Poster';

  return (
    <a href={`/movie/${movie.id}`} className="group relative block overflow-hidden rounded-2xl bg-slate-800 transition-all hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(99,102,241,0.25)] hover:ring-1 hover:ring-indigo-500/50">
      <div className="aspect-[2/3] w-full relative">
        <img 
          src={posterUrl} 
          alt={movie.title || movie.movie_title} 
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      </div>
      <div className="absolute bottom-0 left-0 p-3 md:p-5 w-full transform transition-transform duration-300">
        <h3 className="text-base md:text-xl font-bold text-white line-clamp-2 leading-tight group-hover:text-indigo-300 transition-colors">
          {movie.title || movie.movie_title}
        </h3>
        {movie.release_date && (
          <p className="text-[10px] md:text-sm font-medium text-slate-400 mt-1 md:mt-2">{new Date(movie.release_date).getFullYear()}</p>
        )}
        {movie.rating && (
          <div className="mt-2 md:mt-3 flex items-center gap-2">
            <span className="bg-gradient-to-r from-indigo-500/30 to-purple-500/30 text-indigo-200 text-[10px] md:text-xs font-bold px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-indigo-500/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              ★ {movie.rating}/10
            </span>
          </div>
        )}
      </div>
    </a>
  );
}
