"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleLikeReview(reviewId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Please log in to like reviews." };
    }

    // Check if like exists
    const { data: existingLike } = await supabase
      .from("review_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("review_id", reviewId)
      .maybeSingle();

    if (existingLike) {
      // Remove like
      const { error } = await supabase
        .from("review_likes")
        .delete()
        .eq("id", existingLike.id);
      
      if (error) throw error;
    } else {
      // Add like
      const { error } = await supabase
        .from("review_likes")
        .insert({
          user_id: user.id,
          review_id: reviewId
        });
      
      if (error) throw error;
    }

    revalidatePath("/community");
    // Also revalidate the movie page if needed
    // revalidatePath(`/movie/[id]`); 
    
    return { success: true };
  } catch (err: any) {
    console.error("toggleLikeReview error:", err);
    return { success: false, error: err.message };
  }
}

export async function getReviewLikes(reviewId: string) {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("review_likes")
      .select("*", { count: "exact", head: true })
      .eq("review_id", reviewId);

    if (error) throw error;
    return count || 0;
  } catch (err) {
    console.error("getReviewLikes error:", err);
    return 0;
  }
}

export async function checkIfUserLikedReview(reviewId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from("review_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("review_id", reviewId)
      .maybeSingle();

    if (error) throw error;
    return !!data;
  } catch (err) {
    return false;
  }
}
