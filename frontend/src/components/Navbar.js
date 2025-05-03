'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-white">
              LuxeStay
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/properties" className="text-gray-300 hover:text-white transition">
              Properties
            </Link>
            {status === 'authenticated' ? (
              <>
                {session?.user?.role === 'ADMIN' && (
                  <Link 
                    href="/admin/dashboard" 
                    className="text-gray-300 hover:text-white transition bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link href="/my-bookings" className="text-gray-300 hover:text-white transition">
                  My Bookings
                </Link>
                <div className="relative group">
                  <button className="text-gray-300 hover:text-white transition">
                    {session?.user?.name || 'Account'}
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white transition">
                  Sign In
                </Link>
                <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/properties" className="block text-gray-300 hover:text-white transition py-2">
                Properties
              </Link>
              {status === 'authenticated' ? (
                <>
                  {session?.user?.role === 'ADMIN' && (
                    <Link 
                      href="/admin/dashboard" 
                      className="block text-gray-300 hover:text-white transition py-2 bg-blue-600 px-4 rounded-lg"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link href="/my-bookings" className="block text-gray-300 hover:text-white transition py-2">
                    My Bookings
                  </Link>
                  <Link href="/profile" className="block text-gray-300 hover:text-white transition py-2">
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-gray-300 hover:text-white transition py-2"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block text-gray-300 hover:text-white transition py-2">
                    Sign In
                  </Link>
                  <Link href="/register" className="block text-gray-300 hover:text-white transition py-2">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
} 