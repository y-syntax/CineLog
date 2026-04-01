"use client";
import { useState } from 'react';
import { getVibeMatch } from '@/app/actions/vibeMatch';
import { useRouter } from 'next/navigation';

export default function VibeMatchButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const router = useRouter();

  const handleVibeMatch = async () => {
    setLoading(true);
    setResult(null);
    try {
      const match = await getVibeMatch();
      if (match?.error) {
        setResult({ error: match.error });
      } else if (match?.match) {
        setResult(match);
      }
    } catch (err) {
      setResult({ error: "An unexpected error occurred." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative group/vibe z-20">
      <button 
        onClick={handleVibeMatch}
        disabled={loading}
        className="px-8 py-4 bg-slate-900 border border-indigo-500/50 hover:border-indigo-400 rounded-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 hover:from-cyan-300 hover:to-purple-400 transition-all shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_40px_rgba(192,132,252,0.4)] disabled:opacity-50 flex items-center gap-3 group"
      >
        <span className="text-xl">✨</span> 
        {loading ? 'Analyzing Your Vibe...' : 'Find My Vibe Match'}
      </button>

      {/* Result Modal / Popout */}
      {result && (
        <div className="absolute top-full mt-4 right-0 w-80 bg-slate-900 border border-purple-500/30 rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-bold text-white">AI Suggestion</h4>
            <button onClick={() => setResult(null)} className="text-slate-500 hover:text-white">&times;</button>
          </div>
          
          {result.error ? (
            <p className="text-red-400 text-sm">{result.error}</p>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">
                Based on your highest-rated reviews, Gemini suggests you watch:
              </p>
              <div 
                className="block cursor-pointer group/card"
                onClick={() => router.push(`/movie/${result.match.id}`)}
              >
                <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden ring-1 ring-white/10 group-hover/card:ring-purple-500/50 transition-all">
                  <img 
                    src={result.match.poster_path ? `https://image.tmdb.org/t/p/w500${result.match.poster_path}` : 'https://via.placeholder.com/500x750'} 
                    alt={result.title_suggestion}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-80" />
                  <div className="absolute bottom-0 p-4">
                    <p className="font-bold text-white text-lg">{result.title_suggestion}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
