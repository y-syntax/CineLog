CREATE TABLE IF NOT EXISTS public.reviews (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  movie_id integer not null,
  movie_title text not null,
  poster_path text,
  rating numeric(3,1) check (rating >= 1 and rating <= 10) not null,
  review_text text,
  UNIQUE(user_id, movie_id)
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

-- Table for hiding movies the user is not interested in
CREATE TABLE IF NOT EXISTS public.movie_exclusions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  movie_id integer not null,
  UNIQUE(user_id, movie_id)
);

-- Turn on Row Level Security
ALTER TABLE public.movie_exclusions ENABLE ROW LEVEL SECURITY;

-- Allow only the owner to see and manage their exclusions
CREATE POLICY "Users can view their own exclusions." ON public.movie_exclusions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own exclusions." ON public.movie_exclusions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exclusions." ON public.movie_exclusions
  FOR DELETE USING (auth.uid() = user_id);
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT FALSE,
  is_admin BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;


-- Allow anyone to view profiles (to see reviewer names)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles
  FOR SELECT USING (true);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile." ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile." ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Link reviews to profiles for easier joining
ALTER TABLE public.reviews
  ADD CONSTRAINT reviews_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(id);

-- New Table: review_likes
CREATE TABLE IF NOT EXISTS public.review_likes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references auth.users not null,
  review_id uuid references public.reviews on delete cascade not null,
  UNIQUE(user_id, review_id)
);

-- Turn on Row Level Security for likes
ALTER TABLE public.review_likes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to likes count
CREATE POLICY "Likes are viewable by everyone." ON public.review_likes
  FOR SELECT USING (true);

-- Allow authenticated users to like a review
CREATE POLICY "Users can create their own likes." ON public.review_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to unlike a review
CREATE POLICY "Users can delete their own likes." ON public.review_likes
  FOR DELETE USING (auth.uid() = user_id);
