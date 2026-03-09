import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Heart, CheckCircle, Calendar } from 'lucide-react';
import { format, parseISO, differenceInDays } from 'date-fns';

export const Tracker: React.FC = () => {
  const { periodLogs, addPeriodLog } = useApp();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const sorted = [...periodLogs].sort((a, b) => b.startDate.localeCompare(a.startDate));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!startDate || !endDate) { setError('Please fill in both dates.'); return; }
    if (endDate < startDate) { setError('End date must be after start date.'); return; }
    addPeriodLog({ startDate, endDate });
    setSaved(true);
    setStartDate(''); setEndDate('');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Period Tracker 🩸</h1>
        <p className="text-gray-400 text-sm mt-1">Log your period start and end dates to track your cycle.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Log form */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-400 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Log New Period</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period Start Date</label>
              <input
                type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
                max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Period End Date</label>
              <input
                type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
                min={startDate} max={format(new Date(), 'yyyy-MM-dd')}
                className="w-full px-4 py-3 rounded-xl border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white text-gray-800"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-500 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4" /> Period logged successfully!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all"
            >
              Save Period
            </button>
          </form>

          {/* Cycle stats */}
          {sorted.length >= 2 && (
            <div className="mt-6 p-4 bg-pink-50 rounded-xl">
              <p className="text-sm font-semibold text-gray-700 mb-3">Your Cycle Insights</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-pink-500">
                    {Math.round(
                      sorted.slice(0, -1).reduce((acc, log, i) => {
                        const next = sorted[i];
                        return acc + differenceInDays(parseISO(next.startDate), parseISO(sorted[i + 1]?.startDate || log.startDate));
                      }, 0) / Math.max(sorted.length - 1, 1)
                    )}
                  </p>
                  <p className="text-xs text-gray-400">Avg Cycle (days)</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-500">{sorted.length}</p>
                  <p className="text-xs text-gray-400">Periods Logged</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-gray-800 text-lg">Period History</h2>
          </div>

          {sorted.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-12 h-12 text-pink-200 mx-auto mb-3" />
              <p className="text-gray-400">No periods logged yet.</p>
              <p className="text-gray-300 text-sm">Start by logging your first period!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {sorted.map((log, i) => {
                const duration = differenceInDays(parseISO(log.endDate), parseISO(log.startDate)) + 1;
                return (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border border-pink-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${i === 0 ? 'bg-pink-500' : 'bg-pink-300'}`}></div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {format(parseISO(log.startDate), 'MMM d')} – {format(parseISO(log.endDate), 'MMM d, yyyy')}
                        </p>
                        <p className="text-xs text-gray-400">{duration} day{duration !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    {i === 0 && (
                      <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full font-medium">Latest</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Flow guide */}
      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-6">
        <h3 className="font-bold text-gray-800 mb-4">📋 Tracking Guide</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">1</div>
            <div>
              <p className="font-medium text-gray-700">When Period Starts</p>
              <p>Log the first day of your period as the start date.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">2</div>
            <div>
              <p className="font-medium text-gray-700">When Period Ends</p>
              <p>Log the last day when flow stops as the end date.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 text-lg">3</div>
            <div>
              <p className="font-medium text-gray-700">Log Consistently</p>
              <p>The more you log, the more accurate your predictions become!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
