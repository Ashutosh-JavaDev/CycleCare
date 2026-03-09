import React, { useMemo } from 'react';
import { AlertTriangle, FileText, Shield, Users, BarChart3 } from 'lucide-react';
import { useApp } from '../store/AppContext';

export const AdminDashboard: React.FC = () => {
  const { user, posts, symptomLogs, periodLogs } = useApp();

  const symptomStats = useMemo(() => {
    const counts: Record<string, number> = {};
    symptomLogs.forEach(log => {
      log.symptoms.forEach(symptom => {
        counts[symptom] = (counts[symptom] || 0) + 1;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [symptomLogs]);

  const averageCycle = useMemo(() => {
    if (periodLogs.length === 0) return 0;
    const total = periodLogs.reduce((sum, log) => sum + (log.cycleLength || 28), 0);
    return Math.round(total / periodLogs.length);
  }, [periodLogs]);

  if (user?.email !== 'admin@cyclecare.com') {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-rose-100 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 text-rose-500">
            <AlertTriangle className="h-6 w-6" />
            <h1 className="text-xl font-semibold">Admin access required</h1>
          </div>
          <p className="mt-3 max-w-xl text-sm text-slate-500">
            This area is reserved for moderation, education publishing, and platform analytics.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div className="max-w-5xl">
        <p className="text-sm uppercase tracking-[0.24em] text-pink-500/70">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-800">Platform health, moderation, and student wellness insights.</h1>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Users', value: '10,284', icon: Users, tone: 'from-pink-500 to-rose-500' },
          { label: 'Active Users', value: '7,412', icon: Shield, tone: 'from-purple-500 to-indigo-500' },
          { label: 'Forum Posts', value: String(posts.length), icon: FileText, tone: 'from-cyan-500 to-sky-500' },
          { label: 'Avg Cycle Length', value: `${averageCycle} days`, icon: BarChart3, tone: 'from-emerald-500 to-teal-500' },
        ].map(item => (
          <div key={item.label} className="rounded-3xl border border-pink-100 bg-white/90 p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white`}>
              <item.icon className="h-5 w-5" />
            </div>
            <p className="mt-4 text-sm text-slate-500">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-slate-800">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-800">Moderation Queue</h2>
          <div className="mt-5 space-y-3 text-sm text-slate-600">
            {posts.slice(0, 4).map(post => (
              <div key={post.id} className="rounded-2xl bg-slate-50 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-medium text-slate-700">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.comments.length} comments</span>
                </div>
                <p className="mt-2 line-clamp-2">{post.content}</p>
                <div className="mt-3 flex gap-3">
                  <button className="rounded-xl bg-pink-50 px-3 py-2 text-xs font-medium text-pink-600">Review</button>
                  <button className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-500">Hide</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-pink-100 bg-white/90 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Most Common Symptoms</h2>
            <div className="mt-5 space-y-3">
              {symptomStats.map(([symptom, count], index) => (
                <div key={symptom}>
                  <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                    <span>{index + 1}. {symptom}</span>
                    <span>{count}</span>
                  </div>
                  <div className="h-2 rounded-full bg-pink-100">
                    <div className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500" style={{ width: `${Math.min(count * 14, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-800">Content Publishing</h2>
            <p className="mt-2 text-sm text-slate-600">
              Publish new education content, rotate care tips, and maintain a supportive moderation tone across the platform.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-pink-600 shadow-sm">Publish Article</button>
              <button className="rounded-2xl bg-white px-4 py-3 text-sm font-medium text-purple-600 shadow-sm">Queue Video</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};