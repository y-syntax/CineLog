import { getReviews } from '@/app/actions/dbActions';
import MovieCard from '@/components/MovieCard';

export default async function MyMoviesPage() {
  const reviews = await getReviews().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-0 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 md:mb-3">
            My <span className="gradient-text">Visual Journal</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg font-medium">
            You've logged {reviews.length} cinematic experiences.
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-20 md:py-32 bg-slate-800/20 border border-white/5 rounded-3xl px-6">
          <h3 className="text-xl md:text-2xl font-bold text-slate-300">Your journal is empty</h3>
          <p className="text-slate-500 mt-2 text-sm md:text-base">Search for a movie and write your first review to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 gap-y-8 md:gap-y-10">
          {reviews.map((review) => (
            <MovieCard 
              key={review.id} 
              movie={{
                id: review.movie_id,
                title: review.movie_title,
                poster_path: review.poster_path,
                rating: review.rating
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
