import React, { useState } from 'react';
import { useApp } from '../store/AppContext';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useApp();
  const [cycleLength, setCycleLength] = useState(String(user?.cycleLength || 28));
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);

  const saveSettings = () => {
    updateProfile({ cycleLength: Number(cycleLength) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-3xl space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update password and cycle preferences.</p>
      </div>
      <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-slate-200">Cycle preference (days)</span>
          <input value={cycleLength} onChange={e => setCycleLength(e.target.value)} type="number" className="mt-2 w-full px-3 py-2 rounded-xl border border-pink-200 bg-white dark:bg-slate-950 dark:border-slate-700" />
        </label>
        <label className="block text-sm">
          <span className="text-slate-700 dark:text-slate-200">New password</span>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-2 w-full px-3 py-2 rounded-xl border border-pink-200 bg-white dark:bg-slate-950 dark:border-slate-700" placeholder="Enter new password" />
        </label>
        <button onClick={saveSettings} className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-white text-sm">Save Settings</button>
        {saved && <p className="text-emerald-600 text-sm">Settings updated.</p>}
      </div>
    </div>
  );
};