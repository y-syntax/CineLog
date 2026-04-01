CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text,
  rating smallint check (rating >= 1 and rating <= 10) not null,
  review_text text
);

-- Turn on Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can see reviews)
CREATE POLICY "Public reviews are viewable by everyone." ON public.reviews
  FOR SELECT USING (true);

-- Allow authenticated users to insert their own reviews
CREATE POLICY "Users can create a review." ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own reviews
CREATE POLICY "Users can update their own review." ON public.reviews
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow authenticated users to delete their own reviews
CREATE POLICY "Users can delete their own review." ON public.reviews
  FOR DELETE USING (auth.uid() = user_id);
