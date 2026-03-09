import React, { useMemo, useState } from 'react';
import { Bell, Edit3, Lock, LogOut, Moon, Save, UserRound } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const Profile: React.FC = () => {
  const { user, updateProfile, logout, darkMode, toggleDarkMode, periodLogs, symptomLogs } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    age: String(user?.age || ''),
    cycleLength: String(user?.cycleLength || 28),
  });
  const [saved, setSaved] = useState(false);

  const completion = useMemo(() => {
    let score = 40;
    if (periodLogs.length > 0) score += 25;
    if (symptomLogs.length > 0) score += 20;
    if (user?.cycleLength) score += 15;
    return score;
  }, [periodLogs.length, symptomLogs.length, user?.cycleLength]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: form.name,
      email: form.email,
      age: Number(form.age),
      cycleLength: Number(form.cycleLength),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-[0.24em] text-pink-500/70">Profile</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Your private cycle settings, reminders, and account details.</h1>
      </div>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-pink-500 to-purple-500 text-white">
                <UserRound className="h-7 w-7" />
              </div>
              <div>
                <p className="text-lg font-semibold text-slate-800">{user?.name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">Profile completion</span>
                  <span className="text-pink-500">{completion}%</span>
                </div>
                <div className="h-3 rounded-full bg-pink-100">
                  <div className="h-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${completion}%` }} />
                </div>
              </div>

              <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                <div className="rounded-2xl bg-pink-50/70 px-4 py-3">Age: {user?.age}</div>
                <div className="rounded-2xl bg-purple-50/70 px-4 py-3">Cycle length: {user?.cycleLength} days</div>
                <div className="rounded-2xl bg-rose-50/70 px-4 py-3">Tracked periods: {periodLogs.length}</div>
                <div className="rounded-2xl bg-indigo-50/70 px-4 py-3">Symptom entries: {symptomLogs.length}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
            <h2 className="font-semibold text-slate-800">Preferences</h2>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <button
                onClick={toggleDarkMode}
                className="flex w-full items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
              >
                <span className="inline-flex items-center gap-3"><Moon className="h-4 w-4" /> Dark mode</span>
                <span className="font-medium text-pink-500">{darkMode ? 'On' : 'Off'}</span>
              </button>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="inline-flex items-center gap-3"><Bell className="h-4 w-4" /> Daily reminders</span>
                <span className="font-medium text-emerald-500">Enabled</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="inline-flex items-center gap-3"><Lock className="h-4 w-4" /> Secure storage</span>
                <span className="font-medium text-purple-500">Protected</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-100 text-pink-600">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Edit Profile</h2>
              <p className="text-sm text-slate-500">Update the details that shape your cycle predictions.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Name</span>
              <input
                value={form.name}
                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
            </label>
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Email</span>
              <input
                value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
            </label>
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Age</span>
              <input
                type="number"
                value={form.age}
                onChange={e => setForm(prev => ({ ...prev, age: e.target.value }))}
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
            </label>
            <label className="block text-sm text-slate-600">
              <span className="mb-2 block font-medium text-slate-700">Average cycle length</span>
              <input
                type="number"
                value={form.cycleLength}
                onChange={e => setForm(prev => ({ ...prev, cycleLength: e.target.value }))}
                className="w-full rounded-2xl border border-pink-200 bg-white px-4 py-3 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
              />
            </label>
          </div>

          <div className="mt-6 rounded-2xl bg-pink-50/70 px-4 py-4 text-sm text-slate-600">
            Your cycle length setting powers the period prediction algorithm: next period = last logged start date + average cycle length.
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:shadow-pink-200"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {saved && (
            <p className="mt-4 text-sm font-medium text-emerald-600">Profile updated successfully.</p>
          )}
        </form>
      </section>
    </div>
  );
};