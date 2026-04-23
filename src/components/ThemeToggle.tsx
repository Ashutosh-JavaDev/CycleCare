import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../store/AppContext';

interface Props {
  variant?: 'pill' | 'icon';
  className?: string;
}

/**
 * Modern animated dark-mode toggle.
 * - `pill`: switch-style track with sliding thumb (default, used in navbar)
 * - `icon`:  small icon-only round button
 * Persists via AppContext (which writes to localStorage).
 */
export const ThemeToggle: React.FC<Props> = ({ variant = 'pill', className = '' }) => {
  const { darkMode, toggleDarkMode } = useApp();

  if (variant === 'icon') {
    return (
      <button
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        className={`relative w-10 h-10 rounded-full glass flex items-center justify-center text-ink-600 dark:text-ink-100 hover:scale-105 transition-all ${className}`}
      >
        <Sun  className={`absolute w-4 h-4 transition-all duration-500 ${darkMode ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100 text-amber-500'}`} />
        <Moon className={`absolute w-4 h-4 transition-all duration-500 ${darkMode ? 'opacity-100 rotate-0 scale-100 text-indigo-300' : 'opacity-0 -rotate-90 scale-50'}`} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleDarkMode}
      role="switch"
      aria-checked={darkMode}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center w-14 h-7 rounded-full px-1 transition-all duration-300 ${
        darkMode
          ? 'bg-gradient-to-r from-indigo-600 to-purple-700 shadow-[inset_0_2px_6px_rgba(0,0,0,0.4)]'
          : 'bg-gradient-to-r from-amber-300 to-orange-400 shadow-[inset_0_2px_6px_rgba(0,0,0,0.15)]'
      } ${className}`}
    >
      {/* Background icons */}
      <Sun  className={`absolute left-1.5 w-3 h-3 text-white transition-opacity duration-300 ${darkMode ? 'opacity-40' : 'opacity-0'}`} />
      <Moon className={`absolute right-1.5 w-3 h-3 text-white transition-opacity duration-300 ${darkMode ? 'opacity-0' : 'opacity-40'}`} />

      {/* Sliding thumb */}
      <span
        className={`relative inline-flex items-center justify-center w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${
          darkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        <Sun  className={`absolute w-3 h-3 text-amber-500 transition-all duration-300 ${darkMode ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'}`} />
        <Moon className={`absolute w-3 h-3 text-indigo-600 transition-all duration-300 ${darkMode ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'}`} />
      </span>
    </button>
  );
};
