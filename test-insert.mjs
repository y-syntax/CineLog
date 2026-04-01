import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  if (userError || !users.length) {
    console.error("No users found. Please ensure you created an account.");
    process.exit(1);
  }
  const userId = users[0].id;

  const tmdbRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&query=Inception`);
  const tmdbData = await tmdbRes.json();
  const inception = tmdbData.results[0];

  const { error } = await supabase.from('reviews').insert({
    user_id: userId,
    movie_id: inception.id,
    movie_title: inception.title,
    poster_path: inception.poster_path,
    rating: 10,
    review_text: "A mind-bending cinematic masterpiece! (Inserted via automated test)"
  });

  if (error) {
    console.error("Database Insert Error:", error.message);
  } else {
    console.log("SUCCESS: Review for Inception successfully added to the database!");
  }
}
run();
