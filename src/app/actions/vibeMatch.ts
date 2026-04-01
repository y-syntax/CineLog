"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getReviews } from "./dbActions";
import { searchMovies } from "./movieApi";

export async function getVibeMatch() {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) throw new Error("Missing Gemini API Key in environment");
  
  const genAI = new GoogleGenerativeAI(API_KEY);

  const reviews = await getReviews();
  if (!reviews || reviews.length === 0) {
    return { error: "No reviews found. Add some reviews so we can detect your vibe!" };
  }

  // Extract recent highly-rated movies to form a prompt
  const recentFavorites = reviews
    .filter((r) => r.rating >= 7)
    .slice(0, 10)
    .map((r) => r.movie_title)
    .join(", ");

  if (!recentFavorites) {
    return { error: "You don't have enough highly-rated movies yet to find a vibe match." }
  }

  const prompt = `Based on my recent favorite movies: ${recentFavorites}. 
Suggest EXACTLY ONE highly recommended movie I haven't seen that has a similar "vibe". 
Only output the exact title of the movie and nothing else (no punctuation, no years, no quotes).`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendedTitle = response.text().trim();

    // Search TMDB for this title
    const searchResults = await searchMovies(recommendedTitle);
    if (searchResults && searchResults.length > 0) {
      // Prioritize exact or close matches
      const bestMatch = searchResults[0];
      return { match: bestMatch, title_suggestion: recommendedTitle };
    }
    return { error: `We suggested "${recommendedTitle}", but couldn't find it on TMDB.` };
  } catch (error: any) {
    return { error: error.message };
  }
}
