import React, { useMemo, useState } from 'react';
import { ExternalLink, Phone } from 'lucide-react';

const hospitals = [
  {
    hospitalName: 'City Women Care Hospital',
    address: 'MG Road, Central District',
    city: 'Bengaluru',
    contactNumber: '+91-80-4100-1200',
    emergencyNumber: '+91-80-4100-0001',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    hospitalName: 'Sunrise Gynecology Center',
    address: 'Anna Salai, Teynampet',
    city: 'Chennai',
    contactNumber: '+91-44-3200-2200',
    emergencyNumber: '+91-44-3200-0002',
    latitude: 13.0827,
    longitude: 80.2707,
  },
  {
    hospitalName: 'Pink Lotus Clinic',
    address: 'Baner Main Road',
    city: 'Pune',
    contactNumber: '+91-20-4800-3000',
    emergencyNumber: '+91-20-4800-0003',
    latitude: 18.5204,
    longitude: 73.8567,
  },
];

export const Hospitals: React.FC = () => {
  const [city, setCity] = useState('');

  const filtered = useMemo(
    () => hospitals.filter(h => h.city.toLowerCase().includes(city.toLowerCase().trim())),
    [city]
  );

  return (
    <div className="p-6 space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Nearest Hospital</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Search by city and quickly call or get directions to gynecology support.</p>
      </div>

      <input
        value={city}
        onChange={e => setCity(e.target.value)}
        placeholder="Search hospitals by city"
        className="w-full max-w-lg px-4 py-3 rounded-xl border border-pink-200 bg-white dark:bg-slate-900 dark:border-slate-800"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map(h => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${h.latitude},${h.longitude}`;
          return (
            <article key={h.hospitalName} className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">
              <h2 className="font-semibold text-slate-800 dark:text-slate-100">{h.hospitalName}</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">{h.address}, {h.city}</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">Contact: {h.contactNumber}</p>
              <p className="text-sm text-rose-500 mt-1">Emergency: {h.emergencyNumber}</p>
              <div className="flex gap-2 mt-4">
                <a href={`tel:${h.contactNumber}`} className="inline-flex items-center gap-2 rounded-xl bg-pink-500 px-3 py-2 text-white text-sm">
                  <Phone className="w-4 h-4" /> Call Hospital
                </a>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-pink-200 px-3 py-2 text-sm text-pink-600 dark:text-pink-300 dark:border-slate-700">
                  <ExternalLink className="w-4 h-4" /> Open Map Direction
                </a>
              </div>
            </article>
          );
        })}
      </div>

      <div className="rounded-2xl overflow-hidden border border-pink-100 dark:border-slate-800">
        <iframe
          title="Hospital map"
          src="https://www.google.com/maps?q=gynecology%20hospital&output=embed"
          className="w-full h-72"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};