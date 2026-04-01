import './globals.css';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { logout } from '@/app/actions/authActions';

export const metadata = {
  title: 'CineLog - Your Beautiful Movie Journal',
  description: 'Track, review, and discover movies with AI',
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col bg-slate-900 text-slate-50 selection:bg-indigo-500/30">
        <nav className="fixed top-0 w-full z-50 glass">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="text-3xl font-extrabold tracking-tighter gradient-text hover:opacity-80 transition-opacity">
                CineLog
              </Link>
              <div className="flex gap-8 items-center font-bold text-sm tracking-wide">
                <Link href="/" className="hover:text-indigo-400 transition-colors">Search</Link>
                {user && <Link href="/my-movies" className="hover:text-indigo-400 transition-colors">My Movies</Link>}
                
                {user ? (
                  <form action={logout}>
                    <button type="submit" className="text-slate-300 hover:text-white bg-white/5 py-2 px-4 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                      Logout
                    </button>
                  </form>
                ) : (
                  <Link href="/login" className="bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-5 rounded-lg transition-colors shadow-lg shadow-indigo-500/20">
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 pt-28 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
