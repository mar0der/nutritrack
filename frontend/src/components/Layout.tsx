import { type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

interface LayoutProps {
  children: ReactNode;
}

const navigation = [
  { name: 'Home', href: '/', icon: '🏠' },
  { name: 'Ingredients', href: '/ingredients', icon: '🥕' },
  { name: 'Dishes', href: '/dishes', icon: '🍽️' },
  { name: 'Consumption', href: '/consumption', icon: '📊' },
  { name: 'Recommendations', href: '/recommendations', icon: '✨' },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="glass-effect shadow-lg border-b border-white border-opacity-20 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center group">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <SparklesIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-blue-600 bg-clip-text text-transparent">
                      NutriTrack
                    </h1>
                    <p className="text-xs text-gray-500 font-medium">Smart Nutrition</p>
                  </div>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:ml-10 md:flex md:space-x-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-primary-100 text-primary-700 shadow-md'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* User menu and mobile menu button */}
            <div className="flex items-center space-x-4">
              {/* User menu */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    type="button"
                    className="flex items-center space-x-2 p-2 rounded-lg text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    {user?.avatar ? (
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user.avatar}
                        alt={user.name}
                      />
                    ) : (
                      <UserIcon className="h-6 w-6" />
                    )}
                    <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  </button>
                  
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                          <div className="font-medium">{user?.name}</div>
                          <div className="text-gray-500">{user?.email}</div>
                        </div>
                        <button
                          onClick={logout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors duration-200"
                  >
                    Sign in
                  </Link>
                  {/* Debug indicator - remove after testing */}
                  {process.env.NODE_ENV === 'development' && (
                    <span className="text-xs text-gray-500">
                      Auth: {isAuthenticated ? 'Y' : 'N'}
                    </span>
                  )}
                </div>
              )}
              
              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  type="button"
                  className="inline-flex items-center justify-center p-2 rounded-lg text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors duration-200"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <span className="sr-only">Open main menu</span>
                  {mobileMenuOpen ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white border-opacity-20">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white bg-opacity-80 backdrop-blur-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                    location.pathname === item.href
                      ? 'bg-primary-100 text-primary-700 shadow-md'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-gray-200 bg-white bg-opacity-50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2">
              <SparklesIcon className="h-5 w-5 text-primary-500" />
              <p className="text-sm text-gray-600">
                © 2024 NutriTrack. Built for better nutrition.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-xs text-gray-500">
                Smart recommendations • Ingredient tracking • Health focused
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}