import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { addDays, differenceInDays, format, parseISO } from 'date-fns';
import { fetchCurrentUser, loginUser, registerUser } from '../api/client';

export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  cycleLength: number;
  avatar?: string;
}

export interface PeriodLog {
  id: number;
  startDate: string;
  endDate: string;
  cycleLength?: number;
}

export interface SymptomLog {
  id: number;
  date: string;
  symptoms: string[];
  painLevel: number;
  notes: string;
}

export interface Post {
  id: number;
  author: string;
  anonymous: boolean;
  content: string;
  category: string;
  timestamp: string;
  upvotes: number;
  popularity: number;
  comments: Comment[];
  userUpvoted: boolean;
}

export interface Comment {
  id: number;
  author: string;
  text: string;
  timestamp: string;
}

interface AppState {
  currentPage: string;
  user: User | null;
  isLoggedIn: boolean;
  periodLogs: PeriodLog[];
  symptomLogs: SymptomLog[];
  posts: Post[];
  darkMode: boolean;
  setPage: (page: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (data: SignupData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addPeriodLog: (log: Omit<PeriodLog, 'id'>) => void;
  addSymptomLog: (log: Omit<SymptomLog, 'id'>) => void;
  addPost: (post: Omit<Post, 'id' | 'upvotes' | 'popularity' | 'comments' | 'userUpvoted' | 'timestamp'>) => void;
  upvotePost: (postId: number) => void;
  addComment: (postId: number, comment: string) => void;
  updateProfile: (data: Partial<User>) => void;
  toggleDarkMode: () => void;
  getNextPeriodDate: () => string | null;
  getDaysUntilNextPeriod: () => number | null;
  getPredictedDates: () => string[];
  getOvulationDates: () => string[];
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  age: number;
  cycleLength?: number;
}

const today = new Date();
const fmt = (d: Date) => format(d, 'yyyy-MM-dd');

const SAMPLE_PERIODS: PeriodLog[] = [
  { id: 1, startDate: fmt(addDays(today, -84)), endDate: fmt(addDays(today, -79)), cycleLength: 28 },
  { id: 2, startDate: fmt(addDays(today, -56)), endDate: fmt(addDays(today, -51)), cycleLength: 28 },
  { id: 3, startDate: fmt(addDays(today, -28)), endDate: fmt(addDays(today, -23)), cycleLength: 28 },
];

const SAMPLE_SYMPTOMS: SymptomLog[] = [
  { id: 1, date: fmt(addDays(today, -28)), symptoms: ['Cramps', 'Fatigue'], painLevel: 7, notes: 'First day was rough' },
  { id: 2, date: fmt(addDays(today, -27)), symptoms: ['Cramps', 'Headache', 'Mood Swings'], painLevel: 5, notes: '' },
  { id: 3, date: fmt(addDays(today, -26)), symptoms: ['Fatigue', 'Back Pain'], painLevel: 3, notes: 'Feeling better' },
  { id: 4, date: fmt(addDays(today, -5)), symptoms: ['Acne'], painLevel: 2, notes: 'Pre-period symptoms' },
];

const SAMPLE_POSTS: Post[] = [
  {
    id: 1, author: 'Anonymous', anonymous: true,
    content: 'Has anyone else noticed their cramps getting worse during exams? The stress seems to make everything worse 😔',
    category: 'General', timestamp: fmt(addDays(today, -3)),
    upvotes: 24, popularity: 24, userUpvoted: false,
    comments: [
      { id: 1, author: 'Anonymous', text: 'Yes! Stress definitely affects your cycle. Try some light yoga!', timestamp: fmt(addDays(today, -2)) },
      { id: 2, author: 'Maya', text: 'Heat patches helped me a lot during exam season 💗', timestamp: fmt(addDays(today, -2)) },
    ]
  },
  {
    id: 2, author: 'Riya K.', anonymous: false,
    content: 'Sharing this: swimming during periods actually helped me feel so much better! The warm water really eases cramps. Anyone else tried this?',
    category: 'Lifestyle', timestamp: fmt(addDays(today, -5)),
    upvotes: 41, popularity: 41, userUpvoted: false,
    comments: [
      { id: 3, author: 'Sneha', text: 'Yes swimming is amazing! Low impact and very soothing.', timestamp: fmt(addDays(today, -4)) },
    ]
  },
  {
    id: 3, author: 'Anonymous', anonymous: true,
    content: 'My cycle has been irregular for 6 months now. Should I be worried? I am 19 years old.',
    category: 'Health', timestamp: fmt(addDays(today, -7)),
    upvotes: 18, popularity: 18, userUpvoted: false,
    comments: [
      { id: 4, author: 'Health Guide', text: 'Irregular cycles can be caused by stress, diet changes, or hormonal shifts. Please consult a gynecologist if it continues!', timestamp: fmt(addDays(today, -6)) },
    ]
  },
  {
    id: 4, author: 'Ananya M.', anonymous: false,
    content: 'Just wanted to share – I started tracking my symptoms here and it helped me identify I might have PCOS. Got diagnosed and now I am getting proper treatment. This app literally changed my life! 🌸',
    category: 'Success Stories', timestamp: fmt(addDays(today, -10)),
    upvotes: 89, popularity: 89, userUpvoted: false,
    comments: [],
  },
];

const AppContext = createContext<AppState | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [periodLogs, setPeriodLogs] = useState<PeriodLog[]>(SAMPLE_PERIODS);
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>(SAMPLE_SYMPTOMS);
  const [posts, setPosts] = useState<Post[]>(SAMPLE_POSTS);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('cyclecare-theme');
    if (saved) return saved === 'dark';
    // Fall back to system preference on first visit
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  // Apply theme to <html> so it cascades across every page + CSS variables
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('cyclecare-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem('cyclecare-token');
    if (!token) return;

    fetchCurrentUser(token)
      .then(({ user: profile }) => {
        setUser({
          id: profile.id,
          name: profile.name,
          email: profile.email,
          age: profile.age,
          cycleLength: profile.cycle_length || 28,
        });
        setIsLoggedIn(true);
        setCurrentPage('dashboard');
      })
      .catch(() => {
        localStorage.removeItem('cyclecare-token');
      });
  }, []);

  const setPage = useCallback((page: string) => setCurrentPage(page), []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user: profile } = await loginUser({ email, password });
      localStorage.setItem('cyclecare-token', token);
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        age: profile.age,
        cycleLength: profile.cycle_length || 28,
      });
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed.';
      return { success: false, message };
    }
  }, []);

  const signup = useCallback(async (data: SignupData) => {
    try {
      const { token, user: profile } = await registerUser(data);
      localStorage.setItem('cyclecare-token', token);
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        age: profile.age,
        cycleLength: profile.cycle_length || 28,
      });
      setIsLoggedIn(true);
      setCurrentPage('dashboard');
      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed.';
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('cyclecare-token');
    setCurrentPage('landing');
  }, []);

  const addPeriodLog = useCallback((log: Omit<PeriodLog, 'id'>) => {
    setPeriodLogs(prev => [...prev, { ...log, id: Date.now() }]);
  }, []);

  const addSymptomLog = useCallback((log: Omit<SymptomLog, 'id'>) => {
    setSymptomLogs(prev => {
      const existing = prev.findIndex(s => s.date === log.date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { ...log, id: prev[existing].id };
        return updated;
      }
      return [...prev, { ...log, id: Date.now() }];
    });
  }, []);

  const addPost = useCallback((post: Omit<Post, 'id' | 'upvotes' | 'popularity' | 'comments' | 'userUpvoted' | 'timestamp'>) => {
    setPosts(prev => [{
      ...post, id: Date.now(), upvotes: 0, popularity: 0, comments: [], userUpvoted: false,
      timestamp: fmt(new Date()),
    }, ...prev]);
  }, []);

  const upvotePost = useCallback((postId: number) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? {
          ...p,
          upvotes: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          popularity: p.userUpvoted ? p.upvotes - 1 : p.upvotes + 1,
          userUpvoted: !p.userUpvoted,
        }
        : p
    ));
  }, []);

  const addComment = useCallback((postId: number, comment: string) => {
    setPosts(prev => prev.map(p =>
      p.id === postId
        ? { ...p, comments: [...p.comments, { id: Date.now(), author: user?.name || 'Anonymous', text: comment, timestamp: fmt(new Date()) }] }
        : p
    ));
  }, [user]);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : prev);
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), []);

  const getNextPeriodDate = useCallback((): string | null => {
    if (periodLogs.length === 0) return null;
    const sorted = [...periodLogs].sort((a, b) => a.startDate.localeCompare(b.startDate));
    const last = sorted[sorted.length - 1];
    const cycleLen = user?.cycleLength || 28;
    const nextDate = addDays(parseISO(last.startDate), cycleLen);
    return fmt(nextDate);
  }, [periodLogs, user]);

  const getDaysUntilNextPeriod = useCallback((): number | null => {
    const nextDate = getNextPeriodDate();
    if (!nextDate) return null;
    return differenceInDays(parseISO(nextDate), new Date());
  }, [getNextPeriodDate]);

  const getPredictedDates = useCallback((): string[] => {
    const nextDate = getNextPeriodDate();
    if (!nextDate) return [];
    return Array.from({ length: 5 }, (_, i) => fmt(addDays(parseISO(nextDate), i)));
  }, [getNextPeriodDate]);

  const getOvulationDates = useCallback((): string[] => {
    const nextDate = getNextPeriodDate();
    if (!nextDate) return [];
    const cycleLen = user?.cycleLength || 28;
    const ovulationStart = addDays(parseISO(nextDate), -(cycleLen - 14) - 2);
    return Array.from({ length: 5 }, (_, i) => fmt(addDays(ovulationStart, i)));
  }, [getNextPeriodDate, user]);

  return (
    <AppContext.Provider value={{
      currentPage, user, isLoggedIn, periodLogs, symptomLogs, posts, darkMode,
      setPage, login, signup, logout, addPeriodLog, addSymptomLog,
      addPost, upvotePost, addComment, updateProfile, toggleDarkMode,
      getNextPeriodDate, getDaysUntilNextPeriod, getPredictedDates, getOvulationDates,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
