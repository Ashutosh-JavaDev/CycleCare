import React, { useState } from 'react';
import { useApp } from '../store/AppContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, parseISO, isSameDay, addMonths, subMonths
} from 'date-fns';

export const CycleCalendar: React.FC = () => {
  const { periodLogs, symptomLogs, getPredictedDates, getOvulationDates, setPage } = useApp();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const predictedDates = getPredictedDates();
  const ovulationDates = getOvulationDates();

  const periodDates = new Set<string>();
  periodLogs.forEach(log => {
    const start = parseISO(log.startDate);
    const end = parseISO(log.endDate);
    let cur = start;
    while (cur <= end) {
      periodDates.add(format(cur, 'yyyy-MM-dd'));
      cur = new Date(cur.getTime() + 86400000);
    }
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getDayClass = (day: Date) => {
    const ds = format(day, 'yyyy-MM-dd');
    if (periodDates.has(ds)) return 'period';
    if (predictedDates.includes(ds)) return 'predicted';
    if (ovulationDates.includes(ds)) return 'ovulation';
    return '';
  };

  const getDaySymptoms = (day: Date) => {
    const ds = format(day, 'yyyy-MM-dd');
    return symptomLogs.find(s => s.date === ds);
  };

  const handleDayClick = (day: Date) => {
    setSelectedDay(day);
  };

  const selectedSymptoms = selectedDay ? getDaySymptoms(selectedDay) : null;

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Cycle Calendar 📅</h1>
        <p className="text-gray-400 text-sm mt-1">Visualize your cycle, predicted periods, and ovulation window.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-pink-100 shadow-sm p-6">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCurrentMonth(m => subMonths(m, 1))} className="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-5 h-5 text-pink-500" />
            </button>
            <h2 className="font-bold text-gray-800 text-lg">{format(currentMonth, 'MMMM yyyy')}</h2>
            <button onClick={() => setCurrentMonth(m => addMonths(m, 1))} className="w-9 h-9 rounded-xl bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-pink-500" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, i) => {
              const dayClass = getDayClass(day);
              const inMonth = isSameMonth(day, currentMonth);
              const isToday = isSameDay(day, new Date());
              const hasSymptoms = getDaySymptoms(day);

              return (
                <div
                  key={i} onClick={() => inMonth && handleDayClick(day)}
                  className={`
                    cal-day mx-auto relative
                    ${!inMonth ? 'opacity-20' : ''}
                    ${inMonth ? 'cursor-pointer' : 'cursor-default'}
                    ${dayClass}
                    ${isToday && !dayClass ? 'today' : ''}
                  `}
                >
                  {format(day, 'd')}
                  {hasSymptoms && inMonth && (
                    <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400"></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend & details */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 mb-4">Legend</h3>
            <div className="space-y-3">
              {[
                { color: 'bg-pink-500', label: 'Period Days' },
                { color: 'bg-pink-200 border-2 border-dashed border-pink-400', label: 'Predicted Period' },
                { color: 'bg-blue-100 border-2 border-blue-300', label: 'Ovulation Window' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full ${color} flex-shrink-0`}></div>
                  <span className="text-sm text-gray-600">{label}</span>
                </div>
              ))}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white border-2 border-pink-400 flex-shrink-0 relative">
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                </div>
                <span className="text-sm text-gray-600">Symptom Logged</span>
              </div>
            </div>
          </div>

          {/* Cycle info */}
          <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl border border-pink-100 p-5">
            <h3 className="font-bold text-gray-800 mb-3">Cycle Windows</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 text-xs mb-1">🔴 Menstruation</p>
                <p className="text-gray-700">Days 1–5 of cycle</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">🟡 Follicular Phase</p>
                <p className="text-gray-700">Days 1–13</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">💙 Ovulation</p>
                <p className="text-gray-700">Around Day 14</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs mb-1">🟣 Luteal Phase</p>
                <p className="text-gray-700">Days 15–28</p>
              </div>
            </div>
          </div>

          {/* Selected day details */}
          {selectedDay && (
            <div className="bg-white rounded-2xl border border-pink-100 shadow-sm p-5">
              <h3 className="font-bold text-gray-800 mb-3">
                {format(selectedDay, 'MMMM d, yyyy')}
              </h3>
              <p className="text-xs text-gray-400 mb-1">Status</p>
              <p className="text-sm font-medium text-gray-700 mb-3 capitalize">
                {getDayClass(selectedDay) || 'Normal Day'}
              </p>
              {selectedSymptoms ? (
                <div>
                  <p className="text-xs text-gray-400 mb-2">Logged Symptoms</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedSymptoms.symptoms.map(s => (
                      <span key={s} className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full">{s}</span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Pain Level: {selectedSymptoms.painLevel}/10</p>
                </div>
              ) : (
                <button
                  onClick={() => { setPage('symptoms'); }}
                  className="w-full py-2 text-sm bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
                >
                  Log Symptoms
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
