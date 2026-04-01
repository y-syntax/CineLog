import { getMovieDetails } from '@/app/actions/movieApi';
import { getReviewByMovieId } from '@/app/actions/dbActions';
import ReviewForm from './ReviewForm';

export default async function MoviePage({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);
  const existingReview = await getReviewByMovieId(id).catch(() => null);

  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path || movie.poster_path}`
    : null;

  return (
    <div className="fade-in pb-16">
      {/* Hero Backdrop */}
      {posterUrl && (
        <div className="absolute top-0 left-0 w-full h-[60vh] -z-10">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
          <img 
            src={posterUrl} 
            alt="Backdrop" 
            className="w-full h-full object-cover opacity-30"
          />
        </div>
      )}

      <div className="max-w-6xl mx-auto mt-8 flex flex-col md:flex-row gap-12">
        {/* Poster */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img 
            src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster'}
            alt={movie.title}
            className="w-full rounded-2xl shadow-2xl ring-1 ring-white/10"
          />
        </div>

        {/* Details & Review */}
        <div className="w-full md:w-2/3 lg:w-3/4 space-y-10">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-black text-white">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 items-center text-sm font-medium text-slate-300">
              <span className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                ⭐ {movie.vote_average?.toFixed(1)}/10 TMDB
              </span>
              <span>{movie.release_date}</span>
              <span>{movie.runtime} min</span>
              <div className="flex gap-2">
                {movie.genres?.map(g => (
                  <span key={g.id} className="bg-white/5 px-2 py-1 rounded-md">{g.name}</span>
                ))}
              </div>
            </div>
            <p className="text-lg text-slate-300 leading-relaxed mt-6">{movie.overview}</p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-3xl font-bold mb-6 gradient-text">Your Personal Journal</h2>
            <ReviewForm 
              movieId={movie.id} 
              movieTitle={movie.title} 
              posterPath={movie.poster_path}
              existingReview={existingReview}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
