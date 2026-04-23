"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toggleLikeReview, checkIfUserLikedReview, getReviewLikes } from "@/app/actions/likeActions";

export default function LikeButton({ reviewId, initialLikes = 0 }) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikes);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const isLiked = await checkIfUserLikedReview(reviewId);
      setLiked(isLiked);
      
      // Update count to be sure it's fresh
      const count = await getReviewLikes(reviewId);
      setLikesCount(count);
    }
    checkStatus();
  }, [reviewId]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (loading) return;
    
    setLoading(true);
    // Optimistic UI update
    const prevLiked = liked;
    const prevCount = likesCount;
    
    setLiked(!prevLiked);
    setLikesCount(prevLiked ? prevCount - 1 : prevCount + 1);

    const result = await toggleLikeReview(reviewId);
    
    if (!result.success) {
      // Revert on error
      setLiked(prevLiked);
      setLikesCount(prevCount);
      if (result.error) alert(result.error);
    }
    
    setLoading(false);
  };

  return (
    <button 
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all duration-300 ${
        liked 
          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
          : "bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:border-zinc-500"
      } ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}`}
    >
      <Heart 
        size={18} 
        fill={liked ? "currentColor" : "none"} 
        className={liked ? "scale-110" : ""}
      />
      <span className="text-sm font-medium">{likesCount}</span>
    </button>
  );
}
