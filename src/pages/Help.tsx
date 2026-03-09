import React, { useState } from 'react';

const faqs = [
  { q: 'How is next period predicted?', a: 'CycleCare uses your last start date and average cycle length.' },
  { q: 'Is my data private?', a: 'Yes. Your account is protected and privacy settings are available.' },
  { q: 'Can AI replace doctors?', a: 'No. AI gives educational guidance and not medical diagnosis.' },
];

export const HelpPage: React.FC = () => {
  const [msg, setMsg] = useState('');

  return (
    <div className="p-6 max-w-3xl space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Help & Support</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">FAQ and support contact for menstrual health app guidance.</p>
      </div>

      <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
        {faqs.map(item => (
          <div key={item.q} className="rounded-xl bg-pink-50 dark:bg-slate-800 px-4 py-3">
            <p className="font-medium text-slate-800 dark:text-slate-100">{item.q}</p>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.a}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800 space-y-3">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">Contact Support</h2>
        <textarea value={msg} onChange={e => setMsg(e.target.value)} className="w-full h-28 rounded-xl border border-pink-200 bg-white dark:bg-slate-950 dark:border-slate-700 px-3 py-2" placeholder="Describe your issue..." />
        <button className="rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-2 text-sm text-white">Send Message</button>
      </div>
    </div>
  );
};