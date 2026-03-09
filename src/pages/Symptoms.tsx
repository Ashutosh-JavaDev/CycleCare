import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Activity, CheckCircle, TrendingUp } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale, LinearScale, BarElement, Title,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const SYMPTOM_LIST = [
  { label: 'Cramps', emoji: '🤕' },
  { label: 'Headache', emoji: '🤯' },
  { label: 'Back Pain', emoji: '💪' },
  { label: 'Fatigue', emoji: '😴' },
  { label: 'Mood Swings', emoji: '🎭' },
  { label: 'Acne', emoji: '😮' },
  { label: 'Nausea', emoji: '🤢' },
  { label: 'Bloating', emoji: '🫧' },
  { label: 'Breast Tenderness', emoji: '💗' },
  { label: 'Food Cravings', emoji: '🍫' },
];

export const Symptoms: React.FC = () => {
  const { symptomLogs, addSymptomLog } = useApp();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selected, setSelected] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState(5);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const handleToggle = (sym: string) => {
    setSelected(prev => prev.includes(sym) ? prev.filter(s => s !== sym) : [...prev, sym]);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addSymptomLog({ date: selectedDate, symptoms: selected, painLevel, notes });
    setSaved(true);
    setSelected([]); setPainLevel(5); setNotes('');
    setTimeout(() => setSaved(false), 3000);
  };

  // Analytics data
  const symCount: Record<string, number> = {};
  symptomLogs.forEach(log => {
    log.symptoms.forEach(s => { symCount[s] = (symCount[s] || 0) + 1; });
  });
  const topSymptoms = Object.entries(symCount).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const doughnutData = {
    labels: topSymptoms.map(([s]) => s),
    datasets: [{
      data: topSymptoms.map(([, c]) => c),
      backgroundColor: ['#FF6FAE', '#C6A4FF', '#FF8DC3', '#A78BFA', '#F9A8D4', '#DDD6FE'],
      borderWidth: 0,
    }],
  };

  const recentLogs = [...symptomLogs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Symptom Tracker 📊</h1>
        <p className="text-gray-400 text-sm mt-1">Log your daily symptoms and track patterns over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log form */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Log Symptoms</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Symptoms</label>
              <div className="grid grid-cols-2 gap-2">
                {SYMPTOM_LIST.map(({ label, emoji }) => (
                  <button
                    key={label} type="button" onClick={() => handleToggle(label)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                      selected.includes(label)
                        ? 'bg-pink-500 border-pink-500 text-white'
                        : 'bg-white border-pink-200 text-gray-600 hover:border-pink-400'
                    }`}
                  >
                    <span>{emoji}</span> {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pain Level: <span className="text-pink-500 font-bold">{painLevel}/10</span>
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400">Mild</span>
                <input
                  type="range" min="1" max="10" value={painLevel}
                  onChange={e => setPainLevel(parseInt(e.target.value))}
                  style={{ '--value': `${((painLevel - 1) / 9) * 100}%` } as React.CSSProperties}
                  className="flex-1"
                />
                <span className="text-xs text-gray-400">Severe</span>
              </div>
              <div className="flex justify-between mt-2">
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button
                    key={n} type="button" onClick={() => setPainLevel(n)}
                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-all ${
                      painLevel === n ? 'bg-pink-500 text-white' : 'bg-pink-50 text-gray-500 hover:bg-pink-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
              <textarea
                value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                placeholder="Any additional notes about how you're feeling..."
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800 placeholder-gray-300 resize-none text-sm"
              />
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Symptoms saved successfully!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all"
            >
              Save Symptoms
            </button>
          </form>
        </div>

        {/* Analytics */}
        <div className="space-y-4">
          {topSymptoms.length > 0 ? (
            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-pink-500" />
                <h3 className="font-bold text-gray-800">Symptom Frequency</h3>
              </div>
              <div className="flex justify-center" style={{ height: 200 }}>
                <Doughnut data={doughnutData} options={{
                  plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, padding: 12 } } },
                  cutout: '60%',
                }} />
              </div>
            </div>
          ) : null}

          {/* Recent logs */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">Recent Logs</h3>
            {recentLogs.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No symptoms logged yet</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map(log => (
                  <div key={log.id} className="p-3 bg-pink-50/50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-gray-500">{format(parseISO(log.date), 'MMM d, yyyy')}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        log.painLevel >= 7 ? 'bg-red-100 text-red-600' :
                        log.painLevel >= 4 ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        Pain: {log.painLevel}/10
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {log.symptoms.map(s => (
                        <span key={s} className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                      {log.symptoms.length === 0 && <span className="text-xs text-gray-400">No symptoms</span>}
                    </div>
                    {log.notes && <p className="text-xs text-gray-400 italic mt-1">{log.notes}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
