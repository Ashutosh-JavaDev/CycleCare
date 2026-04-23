import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import {
  LayoutDashboard, Calendar, Activity, BookOpen, Bot, Users,
  User, LogOut, Heart, Menu, X, Moon, Sun, Shield, Pill, Apple, Cross, Settings, Lock, CircleHelp,
} from 'lucide-react';

const navGroups: { title: string; items: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] }[] = [
  {
    title: 'Tracking',
    items: [
      { id: 'dashboard',  label: 'Dashboard',         icon: LayoutDashboard },
      { id: 'tracker',    label: 'Period Tracker',    icon: Heart },
      { id: 'symptoms',   label: 'Symptoms',          icon: Activity },
      { id: 'calendar',   label: 'Cycle Calendar',    icon: Calendar },
    ],
  },
  {
    title: 'Health & Care',
    items: [
      { id: 'education',  label: 'Health Education',  icon: BookOpen },
      { id: 'medicines',  label: 'Medicine Guide',    icon: Pill },
      { id: 'foods',      label: 'Pain Relief Foods', icon: Apple },
      { id: 'hospitals',  label: 'Nearest Hospital',  icon: Cross },
    ],
  },
  {
    title: 'Connect',
    items: [
      { id: 'ai',         label: 'AI Assistant',      icon: Bot },
      { id: 'forum',      label: 'Community',         icon: Users },
    ],
  },
  {
    title: 'Account',
    items: [
      { id: 'profile',    label: 'Profile',           icon: User },
      { id: 'settings',   label: 'Settings',          icon: Settings },
      { id: 'privacy',    label: 'Privacy',           icon: Lock },
      { id: 'help',       label: 'Help',              icon: CircleHelp },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const { currentPage, setPage, user, logout, darkMode, toggleDarkMode } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAdmin = user?.email === 'admin@cyclecare.com';

  const handleNav = (id: string) => {
    setPage(id);
    setMobileOpen(false);
  };

  const NavButton = ({ id, label, Icon }: { id: string; label: string; Icon: React.ComponentType<{ className?: string }> }) => (
    <button
      onClick={() => handleNav(id)}
      className={`group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all ${
        currentPage === id
          ? 'nav-active'
          : 'text-ink-500 hover:bg-pink-50/80 hover:text-pink-600 dark:text-ink-300 dark:hover:bg-slate-800/60 dark:hover:text-pink-300'
      }`}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-lg transition-all ${
        currentPage === id
          ? 'bg-gradient-to-br from-pink-500 to-purple-500 text-white shadow-soft'
          : 'bg-pink-50 text-pink-500 group-hover:scale-110 dark:bg-slate-800 dark:text-pink-300'
      }`}>
        <Icon className="w-4 h-4" />
      </span>
      <span className="truncate">{label}</span>
    </button>
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-pink-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-glow">
            <Heart className="w-5 h-5 text-white" fill="white" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg gradient-text leading-none">CycleCare</h1>
            <p className="text-[11px] text-ink-400 mt-1 tracking-wide uppercase">Health Tracker</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-3 py-3 mx-3 mt-4 rounded-2xl glass shadow-soft">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-display font-bold text-sm shadow-soft">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-ink-800 dark:text-white text-sm truncate">{user?.name}</p>
            <p className="text-xs text-ink-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Nav groups */}
      <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ id, label, icon }) => (
                <NavButton key={id} id={id} label={label} Icon={icon} />
              ))}
            </div>
          </div>
        ))}

        {isAdmin && (
          <div>
            <p className="px-3.5 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink-400">Admin</p>
            <NavButton id="admin" label="Admin Panel" Icon={Shield} />
          </div>
        )}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-pink-100 dark:border-slate-800 space-y-1">
        <button
          onClick={toggleDarkMode}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-ink-500 hover:bg-pink-50/70 hover:text-pink-600 dark:text-ink-300 dark:hover:bg-slate-800/60 dark:hover:text-pink-300 transition-all"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-pink-50 text-pink-500 dark:bg-slate-800 dark:text-pink-300">
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </span>
          <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-rose-50 text-rose-500 dark:bg-rose-950/40 dark:text-rose-300">
            <LogOut className="w-4 h-4" />
          </span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-pink-100 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-soft">
            <Heart className="w-4 h-4 text-white" fill="white" />
          </div>
          <span className="font-display font-bold gradient-text text-lg">CycleCare</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors"
        >
          {mobileOpen
            ? <X className="w-5 h-5 text-ink-700 dark:text-white" />
            : <Menu className="w-5 h-5 text-ink-700 dark:text-white" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 z-40 shadow-2xl transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-64 bg-white/85 backdrop-blur-xl dark:bg-slate-900/85 border-r border-pink-100 dark:border-slate-800 flex-col fixed top-0 left-0 h-full z-30 shadow-card">
        <SidebarContent />
      </div>
    </>
  );
};
