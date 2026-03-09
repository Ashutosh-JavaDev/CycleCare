import React, { useState } from 'react';

export const PrivacyPage: React.FC = () => {
  const [anonymous, setAnonymous] = useState(true);

  return (
    <div className="p-6 max-w-3xl space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Privacy</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Control anonymous posting and account privacy actions.</p>
      </div>

      <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-4">
        <label className="flex items-center justify-between rounded-xl bg-pink-50 dark:bg-slate-800 px-4 py-3 text-sm">
          <span className="text-slate-700 dark:text-slate-200">Anonymous posting by default</span>
          <input type="checkbox" checked={anonymous} onChange={e => setAnonymous(e.target.checked)} />
        </label>
        <button className="rounded-xl border border-rose-300 px-4 py-2 text-rose-500 text-sm">Delete Account</button>
      </div>
    </div>
  );
};