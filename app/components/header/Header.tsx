import { Link, useLocation } from '@remix-run/react';

export function Header({ className = '' }: { className?: string } = {}) {
  const location = useLocation();
  return (
    <header className={`w-full bg-[#201d2b] flex items-center justify-between px-8 py-4 shadow-md z-10 ${className}`}>
      <div className="flex items-center gap-3">
        <img src="/logoooo-removebg-preview.png" alt="Promptly Logo" className="h-9 w-9" />
        <span className="text-xl font-extrabold text-white tracking-tight">Promptly</span>
      </div>
      <nav className="flex items-center gap-8">
        <Link
          to="/"
          className={`text-white font-bold text-base px-4 py-2 rounded-full transition focus:outline-none ${location.pathname === '/' ? 'bg-white/10 shadow-md' : 'hover:bg-white/5'}`}
        >
          Challenges
        </Link>
        <Link
          to="/profile"
          className={`text-white font-bold text-base px-4 py-2 rounded-full transition focus:outline-none ${location.pathname === '/profile' ? 'bg-white/10 shadow-md' : 'hover:bg-white/5'}`}
        >
          Profile
        </Link>
      </nav>
    </header>
  );
}
