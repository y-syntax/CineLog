"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function getReviews() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    return data.map(r => ({
      ...r,
      reviewer_name: r.profiles?.full_name || 'Anonymous'
    }));
  } catch (err) {
    console.error("getReviews error:", err);
    return [];
  }
}

export async function getCommunityReviews(options?: { sortBy?: string, minRating?: number, genreId?: number }) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name
        ),
        review_likes (
          id
        )
      `);

    if (options?.minRating) {
      query = query.gte("rating", options.minRating);
    }
    
    if (options?.genreId) {
      query = query.contains("genre_ids", [options.genreId]);
    }

    if (options?.sortBy === 'rating') {
      query = query.order("rating", { ascending: false });
    } else if (options?.sortBy !== 'likes') {
      query = query.order("created_at", { ascending: false });
    }

    const { data, error } = await query.limit(150);

    if (error) throw new Error(error.message);
    
    let results = data.map(r => ({
      ...r,
      reviewer_name: r.profiles?.full_name || 'Anonymous',
      likes_count: r.review_likes?.length || 0
    }));

    if (options?.sortBy === 'likes') {
      results.sort((a, b) => b.likes_count - a.likes_count);
    }

    return results;
  } catch (err) {
    console.error("getCommunityReviews error:", err);
    return [];
  }
}

export async function getReviewByMovieId(movieId: number | string) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;

    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name
        )
      `)
      .eq("movie_id", Number(movieId))
      .eq("user_id", userData.user.id)
      .limit(1)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null;
    
    return {
      ...data,
      reviewer_name: data.profiles?.full_name || 'Anonymous'
    };
  } catch (err) {
    console.error("getReviewByMovieId error:", err);
    return null;
  }
}

export async function saveReview(reviewData: { id?: string, movie_id: number, movie_title: string, poster_path?: string, rating: number, review_text: string, genre_ids?: number[], mood_tags?: string[] }) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { success: false, error: "Unauthorized. Please Login." };

    if (reviewData.id) {
      const { error } = await supabase.from("reviews").update({
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        genre_ids: reviewData.genre_ids || [],
        mood_tags: reviewData.mood_tags || []
      }).eq("id", reviewData.id).eq("user_id", userData.user.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase.from("reviews").insert({
        user_id: userData.user.id,
        movie_id: Number(reviewData.movie_id),
        movie_title: reviewData.movie_title,
        poster_path: reviewData.poster_path,
        rating: reviewData.rating,
        review_text: reviewData.review_text,
        genre_ids: reviewData.genre_ids || [],
        mood_tags: reviewData.mood_tags || []
      });
      if (error) throw new Error(error.message);
    }
    
    revalidatePath("/my-movies");
    revalidatePath("/community");
    revalidatePath(`/movie/${reviewData.movie_id}`);
    return { success: true };
  } catch (err) {
    console.error("saveReview error:", err);
    return { success: false, error: err.message || "Failed to save review." };
  }
}

export async function deleteReview(id: string, movieId?: number) {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", id)
      .eq("user_id", userData.user.id);

    if (error) throw new Error(error.message);
    
    revalidatePath("/my-movies");
    revalidatePath("/community");
    if (movieId) revalidatePath(`/movie/${movieId}`);
    return { success: true };
  } catch (err) {
    console.error("deleteReview error:", err);
    return { success: false, error: err.message || "Failed to delete review." };
  }
}

export async function getAllReviewsForMovie(movieId: number | string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles (
          full_name
        ),
        review_likes (
          id
        )
      `)
      .eq("movie_id", Number(movieId))
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    
    return data.map(r => ({
      ...r,
      reviewer_name: r.profiles?.full_name || 'Anonymous',
      likes_count: r.review_likes?.length || 0
    }));
  } catch (err) {
    console.error("getAllReviewsForMovie error:", err);
    return [];
  }
}

export async function getJournalData() {
  try {
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;

    const { data: reviews, error } = await supabase
      .from("reviews")
      .select(`*`)
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    if (!reviews || reviews.length === 0) {
      return { reviews: [], stats: null, favoriteReview: null, recentMoods: [], userProfile: userData.user.user_metadata };
    }

    // Calculate Stats
    const totalMovies = reviews.length;
    const avgRating = (reviews.reduce((acc, r) => acc + Number(r.rating), 0) / totalMovies).toFixed(1);

    // Group by month
    const monthCounts: Record<string, number> = {};
    reviews.forEach(r => {
      const date = new Date(r.created_at);
      const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
    });
    
    let mostActiveMonth = '';
    let maxCount = 0;
    Object.entries(monthCounts).forEach(([month, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostActiveMonth = month;
      }
    });

    // Top Genre
    const genreCounts: Record<number, number> = {};
    reviews.forEach(r => {
      if (r.genre_ids) {
        r.genre_ids.forEach((gid: number) => {
          genreCounts[gid] = (genreCounts[gid] || 0) + 1;
        });
      }
    });
    
    let topGenreId = null;
    let maxGenreCount = 0;
    Object.entries(genreCounts).forEach(([id, count]) => {
      if (count > maxGenreCount) {
        maxGenreCount = count;
        topGenreId = Number(id);
      }
    });

    // Simple Map of TMDB Genre IDs to names
    const GENRE_MAP: Record<number, string> = {
      28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy", 80: "Crime",
      99: "Documentary", 18: "Drama", 10751: "Family", 14: "Fantasy", 36: "History",
      27: "Horror", 10402: "Music", 9648: "Mystery", 10749: "Romance", 878: "Sci-Fi",
      10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
    };

    const topGenre = topGenreId ? GENRE_MAP[topGenreId] || 'Unknown' : 'None';

    // Favorite Review (Highest rating, most recent)
    const favoriteReview = [...reviews].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    })[0];

    // Recent Moods
    const moodCounts: Record<string, number> = {};
    reviews.forEach(r => {
      if (r.mood_tags) {
        r.mood_tags.forEach((m: string) => {
          moodCounts[m] = (moodCounts[m] || 0) + 1;
        });
      }
    });
    const recentMoods = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0])
      .slice(0, 5);

    return {
      reviews,
      stats: {
        totalMovies,
        avgRating,
        mostActiveMonth,
        topGenre
      },
      favoriteReview,
      recentMoods,
      userProfile: userData.user.user_metadata
    };

  } catch (err) {
    console.error("getJournalData error:", err);
    return null;
  }
}

