"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExclusion(movieId: number) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  const { error } = await supabase.from("movie_exclusions").insert({
    user_id: userData.user.id,
    movie_id: movieId
  });

  if (error) {
    if (error.code === '23505') return true; // Already excluded
    throw new Error(error.message);
  }
  
  revalidatePath("/");
  return true;
}

export async function removeExclusion(movieId: number) {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) throw new Error("Unauthorized");

  const { error } = await supabase.from("movie_exclusions").delete().match({
    user_id: userData.user.id,
    movie_id: movieId
  });

  if (error) throw new Error(error.message);
  
  revalidatePath("/");
  return true;
}

export async function getExclusions() {
  const supabase = await createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return [];

  const { data, error } = await supabase
    .from("movie_exclusions")
    .select("movie_id");

  if (error) throw new Error(error.message);
  return data.map(item => item.movie_id);
}
