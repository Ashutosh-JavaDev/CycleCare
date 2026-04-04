import React, { useState, useEffect } from 'react';
import { useApp } from '../store/AppContext';
import {
  Heart, Calendar, Activity, Bot, Droplets, TrendingUp,
  Lightbulb, ChevronRight, AlertCircle
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Tooltip, Legend);

const healthTips = [
  '💧 Stay hydrated! Drinking 8 glasses of water daily can help reduce bloating during your period.',
  '🧘 Light yoga and stretching can significantly reduce menstrual cramps.',
  '🥗 Iron-rich foods like spinach and lentils help replenish iron lost during menstruation.',
  '🌡️ A warm heating pad on your lower abdomen can ease cramp discomfort.',
  '😴 Getting 7-8 hours of sleep helps regulate hormones and reduce PMS symptoms.',
  '🏃 Regular exercise throughout your cycle can reduce period pain and improve mood.',
  '🍵 Chamomile tea has anti-inflammatory properties that may reduce menstrual cramps.',
  '📱 Tracking your symptoms helps identify patterns and prepare for your next cycle.',
];

export const Dashboard: React.FC = () => {
  const { user, periodLogs, symptomLogs, setPage, getDaysUntilNextPeriod, getNextPeriodDate } = useApp();
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % healthTips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const daysUntil = getDaysUntilNextPeriod();
  const nextDate = getNextPeriodDate();

  useEffect(() => {
    if (daysUntil !== null && daysUntil <= 2 && 'Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('CycleCare Reminder', {
            body: 'Your predicted period may start soon. Prepare your essentials.',
          });
        }
      });
    }
  }, [daysUntil]);

  const sortedPeriods = [...periodLogs].sort((a, b) => b.startDate.localeCompare(a.startDate));
  const lastPeriod = sortedPeriods[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  const recentSymptoms = [...symptomLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const statusColor = daysUntil === null ? 'gray'
    : daysUntil <= 3 ? 'red'
    : daysUntil <= 7 ? 'orange'
    : 'green';

  const statusColors = {
    gray: 'from-gray-400 to-gray-500',
    red: 'from-red-400 to-pink-500',
    orange: 'from-orange-400 to-pink-500',
    green: 'from-green-400 to-teal-500',
  };

  const cycleChartData = {
    labels: periodLogs.slice(-6).map(log => format(parseISO(log.startDate), 'MMM d')),
    datasets: [{
      label: 'Cycle Length',
      data: periodLogs.slice(-6).map(log => log.cycleLength || user?.cycleLength || 28),
      borderColor: '#FF6FAE',
      backgroundColor: 'rgba(255,111,174,0.2)',
      tension: 0.35,
    }],
  };

  const symptomCounts = symptomLogs.reduce<Record<string, number>>((acc, log) => {
    log.symptoms.forEach(s => {
      acc[s] = (acc[s] || 0) + 1;
    });
    return acc;
  }, {});
  const symptomChartData = {
    labels: Object.keys(symptomCounts),
    datasets: [{
      label: 'Frequency',
      data: Object.values(symptomCounts),
      backgroundColor: ['#FF6FAE', '#C6A4FF', '#F9A8D4', '#A78BFA', '#60A5FA', '#34D399'],
    }],
  };

  const painTrendData = {
    labels: symptomLogs.slice(-7).map(log => format(parseISO(log.date), 'MMM d')),
    datasets: [{
      label: 'Pain Level',
      data: symptomLogs.slice(-7).map(log => log.painLevel),
      backgroundColor: '#C6A4FF',
      borderRadius: 8,
    }],
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-sm">{greeting} 👋</p>
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span>!
          </h1>
          <p className="text-gray-400 text-sm mt-1">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPage('tracker')} className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl text-sm font-medium hover:shadow-lg hover:shadow-pink-200 transition-all">
            + Log Period
          </button>
        </div>
      </div>

      {/* Key cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Next period prediction */}
        <div className={`bg-gradient-to-br ${statusColors[statusColor]} rounded-2xl p-6 text-white shadow-lg card-hover col-span-1 sm:col-span-2 lg:col-span-1`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-medium mb-1">Next Period In</p>
              <p className="text-5xl font-bold mb-1">
                {daysUntil === null ? '--' : daysUntil < 0 ? 'Now' : daysUntil}
              </p>
              <p className="text-white/70 text-sm">
                {daysUntil === null ? 'Log a period to predict' : daysUntil < 0 ? 'Period may have started' : 'days'}
              </p>
              {nextDate && (
                <p className="text-white/90 text-sm mt-2 font-medium">
                  Expected: {format(parseISO(nextDate), 'MMM d, yyyy')}
                </p>
              )}
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
              <Droplets className="w-7 h-7 text-white" />
            </div>
          </div>
          {daysUntil !== null && daysUntil <= 5 && (
            <div className="mt-4 bg-white/20 rounded-xl px-3 py-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs">Period arriving soon! Stock up on supplies.</span>
            </div>
          )}
        </div>

        {/* Cycle summary */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-4">
            <p className="font-semibold text-gray-800">Cycle Summary</p>
            <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-500" />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Avg. Cycle Length</span>
              <span className="font-bold text-gray-800">{user?.cycleLength || 28} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Cycles Tracked</span>
              <span className="font-bold text-gray-800">{periodLogs.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Last Period</span>
              <span className="font-bold text-gray-800 text-xs">
                {lastPeriod ? format(parseISO(lastPeriod.startDate), 'MMM d') : 'Not logged'}
              </span>
            </div>
          </div>
        </div>

        {/* Health tip */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-5 h-5 text-purple-500" />
            <p className="font-semibold text-gray-800 text-sm">Daily Health Tip</p>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed transition-all duration-500">
            {healthTips[tipIndex]}
          </p>
          <div className="flex gap-1 mt-4">
            {healthTips.slice(0, 5).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${i === tipIndex % 5 ? 'bg-pink-400 w-6' : 'bg-pink-200 w-2'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Track Period', icon: Heart, color: 'from-pink-400 to-rose-400', page: 'tracker' },
            { label: 'Log Symptoms', icon: Activity, color: 'from-purple-400 to-indigo-400', page: 'symptoms' },
            { label: 'View Calendar', icon: Calendar, color: 'from-blue-400 to-purple-400', page: 'calendar' },
            { label: 'Ask AI', icon: Bot, color: 'from-teal-400 to-cyan-400', page: 'ai' },
          ].map(({ label, icon: Icon, color, page }) => (
            <button
              key={page} onClick={() => setPage(page)}
              className="flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-pink-100 card-hover shadow-sm hover:border-pink-200 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent periods */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Periods</h3>
            <button onClick={() => setPage('tracker')} className="text-pink-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {sortedPeriods.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No periods logged yet</p>
          ) : (
            <div className="space-y-3">
              {sortedPeriods.slice(0, 4).map(log => (
                <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {format(parseISO(log.startDate), 'MMM d')} – {format(parseISO(log.endDate), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.ceil((new Date(log.endDate).getTime() - new Date(log.startDate).getTime()) / (1000 * 60 * 60 * 24) + 1)} days
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent symptoms */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Recent Symptoms</h3>
            <button onClick={() => setPage('symptoms')} className="text-pink-500 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              Log today <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {recentSymptoms.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-6">No symptoms logged yet</p>
          ) : (
            <div className="space-y-3">
              {recentSymptoms.map(log => (
                <div key={log.id} className="p-3 bg-pink-50/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-400">{format(parseISO(log.date), 'MMM d, yyyy')}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-400">Pain:</span>
                      <span className="text-xs font-bold text-pink-500">{log.painLevel}/10</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {log.symptoms.map(s => (
                      <span key={s} className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-semibold mb-3">Cycle History Chart</h3>
          <Line data={cycleChartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-semibold mb-3">Symptom Frequency</h3>
          <Doughnut data={symptomChartData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
          <h3 className="font-semibold mb-3">Pain Level Trend</h3>
          <Bar data={painTrendData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5 dark:bg-rose-950/30 dark:border-rose-900">
          <h3 className="font-semibold text-rose-600 dark:text-rose-300">Emergency Help</h3>
          <p className="text-sm mt-2 text-rose-600/90 dark:text-rose-300">National Women's Helpline: 181 | Emergency: 112</p>
          <button onClick={() => setPage('hospitals')} className="mt-3 px-4 py-2 rounded-xl bg-rose-500 text-white text-sm">Find nearest hospital</button>
        </div>
        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5 dark:bg-purple-950/30 dark:border-purple-900">
          <h3 className="font-semibold text-purple-700 dark:text-purple-200">Self Care Tips</h3>
          <ul className="text-sm mt-2 space-y-1 text-purple-700/90 dark:text-purple-200">
            <li>Yoga: child pose and reclined twist for cramps.</li>
            <li>Breathing: 4-7-8 breathing for anxiety and pain perception.</li>
            <li>Relaxation: warm bath and gentle stretching before leep.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
