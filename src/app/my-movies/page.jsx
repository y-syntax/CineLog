export const dynamic = 'force-dynamic';
import { getReviews } from '@/app/actions/dbActions';
import MovieCard from '@/components/MovieCard';
import VibeMatchButton from './VibeMatchButton';

export default async function MyMoviesPage() {
  const reviews = await getReviews().catch(() => []);

  return (
    <div className="max-w-7xl mx-auto py-10 fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
            My <span className="gradient-text">Visual Journal</span>
          </h1>
          <p className="text-slate-400 text-lg font-medium">
            You've painstakingly logged {reviews.length} cinematic experiences.
          </p>
        </div>
        
        {/* Vibe Match Button */}
        <div className="pb-2">
           <VibeMatchButton />
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-32 bg-slate-800/20 border border-white/5 rounded-3xl">
          <h3 className="text-2xl font-bold text-slate-300">Your journal is empty</h3>
          <p className="text-slate-500 mt-2">Search for a movie and write your first review to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
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
