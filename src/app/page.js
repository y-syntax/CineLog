import { searchMovies, getDiscoveryMovies } from '@/app/actions/movieApi';
import { getVibeMatch } from '@/app/actions/vibeMatch';
import MovieCard from '@/components/MovieCard';
import AutoScroller from '@/components/AutoScroller';
import { getExclusions } from '@/app/actions/userExclusions';
import { getReviews, getCommunityReviews } from '@/app/actions/dbActions';
import { cleanupDuplicates } from '@/app/actions/diagnostics';
import AnimatedHero from '@/components/AnimatedHero';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || '';

  await cleanupDuplicates().catch(err => console.error("Cleanup error:", err));
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [initialDiscovery, exclusions, reviews, communityReviews] = await Promise.all([
    getDiscoveryMovies().catch(() => []),
    getExclusions().catch(() => []),
    getReviews().catch(() => []),
    getCommunityReviews().catch(() => [])
  ]);

  const reviewedIds = reviews.map(r => Number(r.movie_id));
  const excludedIds = exclusions.map(id => Number(id));
  
  const discoveryMovies = initialDiscovery.filter(movie => 
    !excludedIds.includes(Number(movie.id)) && 
    !reviewedIds.includes(Number(movie.id))
  );

  // Pick a featured review
  // For new users (!user or no reviews), pick the highest rated community review.
  // For existing users, pick a community review that isn't their own, or the best one.
  let featuredReview = null;
  if (communityReviews && communityReviews.length > 0) {
    const candidates = user 
      ? communityReviews.filter(r => r.user_id !== user.id && Number(r.rating) >= 8)
      : communityReviews.filter(r => Number(r.rating) >= 8);
    
    featuredReview = candidates.length > 0 ? candidates[0] : communityReviews[0];
  }

  let searchResults = [];
  let vibeMatches = [];
  
  if (query) {
    [searchResults, vibeMatches] = await Promise.all([
      searchMovies(query).catch(() => []),
      getVibeMatch().catch(() => ({ matches: [] }))
    ]);
  }

  const recommendations = vibeMatches?.matches || [];

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. Cinematic Hero Section */}
      <AnimatedHero featuredReview={featuredReview} />

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 py-12">
        
        {/* 2. Floating Magnetic Search Bar */}
        <div className="max-w-3xl mx-auto relative z-30 -mt-28 mb-16">
          <form action="/" className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cinema-red via-red-500 to-orange-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-75 transition duration-500"></div>
            <div className="relative flex items-center bg-cinema-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl transition-all">
              <div className="relative flex-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-hover:text-cinema-red transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  name="q"
                  type="text" 
                  defaultValue={query}
                  placeholder="Search the cinematic universe..." 
                  className="w-full bg-transparent pl-16 pr-6 py-6 text-lg md:text-xl text-white focus:outline-none placeholder-slate-500 tracking-wide font-medium"
                />
              </div>
              <button 
                type="submit" 
                className="px-10 py-6 bg-white hover:bg-slate-200 text-black font-black uppercase tracking-widest transition-all flex-shrink-0"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* 3. Search Results & AI */}
        {query && (
          <div className="space-y-24 pb-12 fade-in">
            {/* Search Results */}
            <section>
              <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                <h2 className="text-3xl font-heading font-black text-white">Search Results</h2>
                <p className="text-cinema-red font-bold tracking-widest uppercase text-xs">Matching "{query}"</p>
              </div>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-20 bg-cinema-surface/50 border border-white/5 rounded-3xl">
                  <h3 className="text-2xl font-bold text-slate-500">No exact matches. Check your vibe below.</h3>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
                  {searchResults.slice(0, 10).map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              )}
            </section>

            {/* AI Vibe Matches */}
            {recommendations.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
                  <h2 className="text-3xl font-heading font-black text-white">Similar Vibes</h2>
                  <p className="text-cinema-red font-bold tracking-widest uppercase text-xs">AI-Curated for You</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
                  {recommendations.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {/* 4. Random Discoveries */}
        {!query && (
          <section className="space-y-6 pt-12 border-t border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-heading font-bold text-white">Top Picks For You</h2>
              <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Auto-generated</span>
            </div>
            {discoveryMovies.length > 0 ? (
              <AutoScroller movies={discoveryMovies} />
            ) : (
              <div className="h-64 flex items-center justify-center bg-cinema-surface rounded-2xl border border-white/5">
                <span className="text-slate-500 font-medium">Loading masterpieces...</span>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
