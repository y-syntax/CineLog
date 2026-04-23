import { getCommunityReviews } from "@/app/actions/dbActions";
import Link from "next/link";
import LikeButton from "@/components/LikeButton";

export const metadata = {
  title: "Community Reviews | CineLog",
  description: "See what other cinephiles are watching and reviewing.",
};

export default async function CommunityPage() {
  const reviews = await getCommunityReviews();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20 pt-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h1 className="text-4xl font-black tracking-tighter text-white mb-2">
            Community <span className="text-rose-500">Reviews</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl">
            Discover your next favorite movie through the eyes of fellow cinephiles.
          </p>
        </header>

        {reviews.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-900">
            <p className="text-zinc-500">No reviews yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-500 flex flex-col h-full"
              >
                {/* Movie Header */}
                <div className="flex gap-4 p-4 border-b border-zinc-800/30">
                  <div className="relative w-16 h-24 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden ring-1 ring-white/10 group-hover:ring-rose-500/50 transition-all duration-500">
                    {review.poster_path ? (
                      <img 
                        src={`https://image.tmdb.org/t/p/w200${review.poster_path}`}
                        alt={review.movie_title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-zinc-600">No Image</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/movie/${review.movie_id}`}
                      className="text-lg font-bold text-zinc-100 hover:text-rose-500 transition-colors leading-tight line-clamp-2"
                    >
                      {review.movie_title}
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded text-xs font-black ring-1 ring-rose-500/20">
                        {review.rating}/10
                      </div>
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-[10px] font-bold text-white uppercase shadow-lg shadow-rose-500/10">
                      {review.reviewer_name[0]}
                    </div>
                    <span className="text-xs font-medium text-zinc-400 truncate">
                      {review.reviewer_name}
                    </span>
                    <span className="text-[10px] text-zinc-600 ml-auto">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-zinc-300 text-sm leading-relaxed line-clamp-6 mb-4 italic">
                    "{review.review_text}"
                  </p>

                  <div className="mt-auto pt-4 border-t border-zinc-800/20 flex justify-between items-center">
                    <LikeButton reviewId={review.id} initialLikes={review.likes_count} />
                    <Link 
                      href={`/movie/${review.movie_id}`}
                      className="text-xs font-black tracking-widest text-zinc-500 hover:text-zinc-300 uppercase transition-colors"
                    >
                      View Movie
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
