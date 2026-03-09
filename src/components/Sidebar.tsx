import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  LayoutDashboard, Calendar, Activity, BookOpen, Bot, Users,
  User, LogOut, Heart, Menu, X, Moon, Sun, Shield, Pill, Apple, Cross, Settings, Lock, CircleHelp
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tracker', label: 'Period Tracker', icon: Heart },
  { id: 'symptoms', label: 'Symptoms', icon: Activity },
  { id: 'calendar', label: 'Cycle Calendar', icon: Calendar },
  { id: 'education', label: 'Health Education', icon: BookOpen },
  { id: 'medicines', label: 'Medicine Guide', icon: Pill },
  { id: 'foods', label: 'Pain Relief Foods', icon: Apple },
  { id: 'hospitals', label: 'Nearest Hospital', icon: Cross },
  { id: 'ai', label: 'AI Assistant', icon: Bot },
  { id: 'forum', label: 'Community', icon: Users },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'privacy', label: 'Privacy', icon: Lock },
  { id: 'help', label: 'Help', icon: CircleHelp },
];

export const Sidebar: React.FC = () => {
  const { currentPage, setPage, user, logout, darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.email === 'admin@cyclecare.com';

  const handleNav = (id: string) => {
    setPage(id);
    setMobileOpen(false);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center shadow-lg">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-bold text-lg gradient-text">CycleCare</h1>
            <p className="text-xs text-gray-400">Health Tracker</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-4 mx-4 mt-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800 text-sm truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              currentPage === id
                ? 'nav-active bg-pink-50 text-pink-500'
                : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
            }`}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
          </button>
        ))}
        {isAdmin && (
          <button
            onClick={() => handleNav('admin')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
              currentPage === 'admin'
                ? 'nav-active bg-pink-50 text-pink-500'
                : 'text-gray-500 hover:bg-pink-50 hover:text-pink-500'
            }`}
          >
            <Shield className="w-4 h-4 flex-shrink-0" />
            <span>Admin Panel</span>
          </button>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-pink-100 space-y-1">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-500 hover:bg-pink-50 hover:text-pink-500 transition-all"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-pink-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6 text-pink-500" fill="currentColor" />
          <span className="font-bold gradient-text text-lg">CycleCare</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-pink-50">
          {mobileOpen ? <X className="w-5 h-5 text-gray-600" /> : <Menu className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-40 shadow-2xl transform transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-white dark:bg-slate-900 border-r border-pink-100 dark:border-slate-800 flex-col fixed top-0 left-0 h-full z-30 shadow-sm">
        <SidebarContent />
      </div>
    </>
  );
};
