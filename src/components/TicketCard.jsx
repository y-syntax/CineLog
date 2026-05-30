import Link from 'next/link';

export default function TicketCard({ review }) {
  const date = new Date(review.created_at);
  const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="group relative flex bg-cinema-surface border border-white/10 rounded-2xl overflow-hidden hover:border-cinema-red/50 transition-all duration-500 shadow-xl w-full">
      {/* Poster Section (Left) */}
      <div className="w-1/3 md:w-48 flex-shrink-0 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cinema-surface z-10" />
        {review.poster_path ? (
          <img 
            src={`https://image.tmdb.org/t/p/w500${review.poster_path}`} 
            alt={review.movie_title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-black/40 flex items-center justify-center text-slate-600">No Image</div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between relative border-l border-dashed border-white/10">
        {/* Ticket cutouts */}
        <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-cinema-dark border-b border-r border-white/10" />
        <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-full bg-cinema-dark border-t border-r border-white/10" />

        <div>
          <div className="flex justify-between items-start mb-2">
            <Link href={`/movie/${review.movie_id}`} className="text-xl md:text-3xl font-heading font-black text-white hover:text-cinema-red transition-colors line-clamp-2">
              {review.movie_title}
            </Link>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-2xl font-black text-cinema-red">{Number(review.rating).toFixed(1)}</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Rating</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {review.mood_tags?.map(mood => (
              <span key={mood} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-300">
                {mood}
              </span>
            ))}
          </div>

          <p className="text-slate-400 text-sm italic line-clamp-3 leading-relaxed">
            "{review.review_text}"
          </p>
        </div>

        <div className="mt-6 flex justify-between items-end border-t border-white/5 pt-4">
          <div className="space-y-1">
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Admit One</div>
            <div className="text-xs text-slate-300 font-mono bg-black/20 px-2 py-1 rounded">
              DATE: {formattedDate} | TIME: {time}
            </div>
          </div>
          <div className="hidden md:block">
            {/* Fake Barcode */}
            <div className="flex gap-1 h-8 opacity-20">
              <div className="w-1 bg-white"></div>
              <div className="w-2 bg-white"></div>
              <div className="w-1 bg-white"></div>
              <div className="w-3 bg-white"></div>
              <div className="w-1 bg-white"></div>
              <div className="w-2 bg-white"></div>
              <div className="w-1 bg-white"></div>
              <div className="w-1 bg-white"></div>
              <div className="w-2 bg-white"></div>
            </div>
            <div className="text-[8px] text-slate-500 text-center mt-1 tracking-[0.3em] font-mono">
              LOG-{review.id.split('-')[0].toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
