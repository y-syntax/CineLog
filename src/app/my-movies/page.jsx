import { getJournalData } from '@/app/actions/dbActions';
import TicketCard from '@/components/TicketCard';
import ActivityHeatmap from '@/components/ActivityHeatmap';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function MyMoviesPage() {
  const journalData = await getJournalData().catch(() => null);

  if (!journalData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cinema-dark text-white">
        <p>Please log in to view your journal.</p>
      </div>
    );
  }

  const { reviews, stats, favoriteReview, recentMoods, userProfile } = journalData;
  const avatarUrl = userProfile?.avatar_url || `https://ui-avatars.com/api/?name=${userProfile?.full_name || 'User'}&background=E50914&color=fff&size=128&bold=true`;

  if (reviews.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 text-center fade-in">
        <div className="bg-black/20 border border-white/5 rounded-3xl p-12 md:p-24 shadow-2xl backdrop-blur-md">
          <div className="w-24 h-24 rounded-full bg-cinema-surface mx-auto flex items-center justify-center text-4xl mb-6 shadow-xl ring-1 ring-white/10">
            🎬
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white mb-4">Your Cinema Starts Here</h1>
          <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
            Search for a movie, log your rating, and start building your personal cinematic diary.
          </p>
          <Link href="/" className="px-8 py-4 bg-cinema-red text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-cinema-red/20 inline-block">
            Find a Movie
          </Link>
        </div>
      </div>
    );
  }

  // Timeline Grouping
  const timeline = {};
  reviews.forEach(r => {
    const monthYear = new Date(r.created_at).toLocaleString('en-US', { month: 'long', year: 'numeric' });
    if (!timeline[monthYear]) timeline[monthYear] = [];
    timeline[monthYear].push(r);
  });

  // Get up to 3 posters for the header collage
  const topPosters = reviews.filter(r => r.poster_path).slice(0, 3).map(r => r.poster_path);

  return (
    <div className="min-h-screen bg-cinema-dark text-slate-100 pb-32 fade-in">
      
      {/* Cinematic Header */}
      <div className="relative h-[40vh] md:h-[50vh] flex items-end justify-center md:justify-start px-4 md:px-12 pb-12 overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 z-0 flex">
          {topPosters.map((path, i) => (
            <div key={i} className="flex-1 h-full relative">
              <img src={`https://image.tmdb.org/t/p/w1280${path}`} className="w-full h-full object-cover opacity-30" alt="Backdrop" />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-dark via-cinema-dark/80 to-transparent" />
          <div className="absolute inset-0 bg-cinema-dark/20 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-cinema-dark shadow-2xl">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
          </div>
          <div className="mb-2">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-white tracking-tight drop-shadow-lg">
              {userProfile?.full_name || 'My'} <span className="text-cinema-red">Journal</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl italic mt-2 drop-shadow-md">
              "Watching movies one existential crisis at a time."
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 mt-12 space-y-16">
        
        {/* Stats & Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ActivityHeatmap reviews={reviews} />
          </div>
          
          <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] shadow-2xl backdrop-blur-md flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-0.5 w-6 bg-cinema-red" />
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Lifetime Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              <div>
                <div className="text-4xl font-black text-white">{stats?.totalMovies}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Films Logged</div>
              </div>
              <div>
                <div className="text-4xl font-black text-cinema-red">{stats?.avgRating}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Avg Rating</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white line-clamp-1">{stats?.topGenre}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Top Genre</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white line-clamp-1">{stats?.mostActiveMonth}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-bold">Most Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recently Felt & Favorite Frame */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recently Felt */}
          {recentMoods?.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-slate-700" />
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Recently Felt</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {recentMoods.map(mood => (
                  <div key={mood} className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm text-sm font-bold text-white shadow-lg hover:bg-white/10 transition-colors">
                    {mood}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Favorite Frame */}
          {favoriteReview && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-cinema-red" />
                <h3 className="text-xs font-bold text-cinema-red uppercase tracking-widest">Latest Masterpiece</h3>
              </div>
              <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
                <img 
                  src={`https://image.tmdb.org/t/p/w1280${favoriteReview.poster_path}`} 
                  alt={favoriteReview.movie_title}
                  className="w-full h-48 md:h-64 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute bottom-0 left-0 p-6 z-20 w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-xs text-cinema-red font-black tracking-widest uppercase mb-1">
                        {Number(favoriteReview.rating) === 10 ? '10/10 Perfect' : `${Number(favoriteReview.rating).toFixed(1)}/10 Rated`}
                      </div>
                      <Link href={`/movie/${favoriteReview.movie_id}`} className="text-2xl font-black text-white hover:underline">
                        {favoriteReview.movie_title}
                      </Link>
                    </div>
                    <div className="text-4xl text-white/20 font-serif">"</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Timeline */}
        <div className="pt-12">
          <div className="flex items-center gap-3 mb-12">
            <h2 className="text-3xl font-heading font-black text-white tracking-tight">Timeline</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent" />
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-8 space-y-16 pb-8">
            {Object.entries(timeline).map(([month, monthReviews]) => (
              <div key={month} className="relative">
                {/* Timeline Node */}
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-cinema-red shadow-[0_0_10px_rgba(229,9,20,0.8)]" />
                <div className="pl-8 md:pl-12">
                  <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest">{month}</h3>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {monthReviews.map(review => (
                      <TicketCard key={review.id} review={review} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
