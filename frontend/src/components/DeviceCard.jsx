import { useState } from 'react';
import { StatusBadge } from './StatusBadge';
import { api } from '../api';

function InfoSection({ label, value }) {
  if (!value) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="text-slate-200 whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export function DeviceCard({ device, onEdit, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const isStored = device.status === 'eingelagert';

  async function toggleStorage() {
    setLoading(true);
    try {
      const newStatus = isStored ? 'nicht_produktiv' : 'eingelagert';
      const updated = await api.setStatus(device.id, newStatus);
      onUpdate(updated);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-slate-700">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-2xl font-bold text-blue-400 leading-none">{device.id}</p>
            {device.name && <p className="mt-1 text-slate-300 text-base">{device.name}</p>}
          </div>
          <StatusBadge status={device.status} size="lg" />
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-5 space-y-5">
        <InfoSection label="Hardware" value={device.hardware} />
        <InfoSection label="Software" value={device.software} />
        <InfoSection label="Standort" value={device.location} />
        <InfoSection label="Notizen" value={device.notes} />

        <div className="pt-1 text-xs text-slate-600">
          Aktualisiert: {new Date(device.updated_at).toLocaleString('de-DE')}
        </div>
      </div>

      {/* Actions */}
      <div className="px-6 pb-6 flex gap-3">
        <button
          onClick={onEdit}
          className="flex-1 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition active:scale-95 text-base"
        >
          Bearbeiten
        </button>
        <button
          onClick={toggleStorage}
          disabled={loading}
          className={`flex-1 py-3 rounded-xl font-medium transition active:scale-95 text-base ${
            isStored
              ? 'bg-violet-600 hover:bg-violet-500 text-white'
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          } disabled:opacity-50`}
        >
          {loading ? '…' : isStored ? 'Auslagern' : 'Einlagern'}
        </button>
      </div>
    </div>
  );
}
