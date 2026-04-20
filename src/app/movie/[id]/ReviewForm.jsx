"use client";
import { useState } from 'react';
import { saveReview, deleteReview } from '@/app/actions/dbActions';
import { useRouter } from 'next/navigation';

export default function ReviewForm({ movieId, movieTitle, posterPath, existingReview, onCancel, onSuccess }) {
  const [rating, setRating] = useState(existingReview?.rating || 10);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await saveReview({
        id: existingReview?.id,
        movie_id: Number(movieId),
        movie_title: movieTitle,
        poster_path: posterPath,
        rating: Number(rating),
        review_text: reviewText
      });
      
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
          router.push('/my-movies');
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReview?.id) return;
    if (!confirm('Are you sure you want to delete this review?')) return;
    setLoading(true);
    try {
      const result = await deleteReview(existingReview.id, Number(movieId));
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.refresh();
          router.push('/my-movies');
        }
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6 bg-slate-900 p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0" />
      
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-white">{existingReview ? 'Update Your Review' : 'Add a Review'}</h3>
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-xl text-sm border border-red-500/20">{error}</div>}
        
        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Your Rating (1-10)</label>
          <div className="flex items-center gap-4">
            <input 
              type="range" 
              min="1" 
              max="10" 
              step="0.1"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="w-full max-w-xs accent-indigo-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-3xl font-black text-white w-16 text-center">{Number(rating).toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-bold text-slate-300 uppercase tracking-wider">Your Review</label>
          <textarea 
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            rows={5}
            className="w-full bg-slate-950/50 border border-white/10 rounded-xl p-4 md:p-5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 placeholder-slate-600 transition-all resize-none text-base"
            placeholder={`What did you think of ${movieTitle}?`}
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 font-bold text-white rounded-xl transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/25"
          >
            {loading ? 'Saving...' : (existingReview ? 'Update Journal' : 'Save to Journal')}
          </button>

          {existingReview && (
            <button 
              type="button" 
              onClick={handleDelete}
              disabled={loading}
              className="px-6 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl transition-all disabled:opacity-50"
            >
              Delete
            </button>
          )}
          
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel}
              className="sm:hidden px-6 py-4 bg-white/5 hover:bg-white/10 text-slate-300 font-bold rounded-xl transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
