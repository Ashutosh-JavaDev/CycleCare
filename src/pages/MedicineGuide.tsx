import React from 'react';
import { AlertTriangle, Pill } from 'lucide-react';

const medicines = [
  {
    name: 'Ibuprofen',
    usage: 'Helps reduce cramps and inflammation during period pain.',
    dosage: '200-400 mg every 6-8 hours after meals.',
    warning: 'Avoid if you have kidney disease, ulcers, or NSAID allergy.',
  },
  {
    name: 'Naproxen',
    usage: 'Longer-lasting relief for moderate menstrual pain.',
    dosage: '220 mg every 8-12 hours as needed.',
    warning: 'Do not combine with other NSAIDs unless prescribed.',
  },
  {
    name: 'Mefenamic Acid',
    usage: 'Often prescribed for dysmenorrhea and heavy cramping.',
    dosage: '500 mg initially, then 250 mg every 6 hours (doctor advised).',
    warning: 'Use only under professional advice for safest dosing.',
  },
  {
    name: 'Paracetamol',
    usage: 'Mild pain and headache relief when cramps are not severe.',
    dosage: '500-650 mg every 6 hours; max daily limit applies.',
    warning: 'Avoid overdose. Do not mix with other acetaminophen medicines.',
  },
];

export const MedicineGuide: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Medicine Guide</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Safe educational guidance for commonly used period-pain medicines.</p>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-700 text-sm dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-200">
        Always consult a doctor before taking medicine.
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {medicines.map(item => (
          <article key={item.name} className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Pill className="w-4 h-4 text-pink-500" />
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">{item.name}</h2>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-3">{item.usage}</p>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-2"><span className="font-semibold">Recommended dosage:</span> {item.dosage}</p>
            <div className="mt-3 rounded-xl bg-rose-50 border border-rose-100 px-3 py-2 text-xs text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
              <AlertTriangle className="inline w-3.5 h-3.5 mr-1" />
              {item.warning}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};