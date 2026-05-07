import { useEffect, useState } from 'react';
import { api } from '../api';
import { StatusBadge } from './StatusBadge';

export function DeviceList({ onSelect, onClose }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getDevices().then(setDevices).finally(() => setLoading(false));
  }, []);

  const filtered = devices.filter(d => {
    const q = search.toLowerCase();
    return d.id.toLowerCase().includes(q) || d.name.toLowerCase().includes(q);
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">Alle Geräte</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-4 py-3 border-b border-slate-700">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filtern …"
            className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        <div className="overflow-y-auto flex-1">
          {loading && (
            <div className="flex justify-center py-12 text-slate-500">Lädt …</div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="flex justify-center py-12 text-slate-500">Keine Geräte gefunden</div>
          )}
          {filtered.map(d => (
            <button
              key={d.id}
              onClick={() => { onSelect(d); onClose(); }}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-700 border-b border-slate-700/50 last:border-0 text-left transition"
            >
              <div>
                <p className="font-mono text-blue-400 font-medium">{d.id}</p>
                <p className="text-slate-400 text-sm mt-0.5">{d.name || d.hardware || '—'}</p>
              </div>
              <StatusBadge status={d.status} />
            </button>
          ))}
        </div>

        <div className="px-6 py-3 border-t border-slate-700 text-xs text-slate-600 text-center">
          {filtered.length} Gerät{filtered.length !== 1 ? 'e' : ''}
        </div>
      </div>
    </div>
  );
}
