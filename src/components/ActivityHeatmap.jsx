export default function ActivityHeatmap({ reviews }) {
  // Generate last 60 days
  const today = new Date();
  const days = [];
  for (let i = 59; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d.toISOString().split('T')[0]); // YYYY-MM-DD
  }

  // Map watch dates
  const watchDates = new Set(reviews.map(r => new Date(r.created_at).toISOString().split('T')[0]));

  return (
    <div className="bg-black/20 border border-white/5 p-6 rounded-[2rem] shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-2 h-2 rounded-full bg-cinema-red animate-pulse" />
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Watching Habits (Last 60 Days)</h3>
      </div>
      
      <div className="flex flex-wrap gap-1.5 md:gap-2">
        {days.map((day, idx) => {
          const watched = watchDates.has(day);
          return (
            <div 
              key={day}
              title={watched ? `Watched a movie on ${day}` : `No movies logged on ${day}`}
              className={`w-3 h-3 md:w-4 md:h-4 rounded-sm transition-all duration-300 ${watched ? 'bg-cinema-red shadow-[0_0_10px_rgba(229,9,20,0.5)]' : 'bg-white/5 hover:bg-white/10'}`}
            />
          );
        })}
      </div>
      <div className="mt-4 flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
        <span>60 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );
}
