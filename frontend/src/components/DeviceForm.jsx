import { useState } from 'react';
import { api } from '../api';
import { STATUS_CONFIG } from './StatusBadge';

const EMPTY = {
  id: '', name: '', hardware: '', software: '', location: '', status: 'nicht_produktiv', notes: '',
};

export function DeviceForm({ device, onSave, onDelete, onClose }) {
  const isEdit = !!device;
  const [form, setForm] = useState(device ?? EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function set(field) {
    return (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const saved = isEdit
        ? await api.updateDevice(device.id, form)
        : await api.createDevice(form);
      onSave(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setLoading(true);
    try {
      await api.deleteDevice(device.id);
      onDelete();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-base';

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-lg bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">
            {isEdit ? `Bearbeiten: ${device.id}` : 'Neues Gerät'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-200 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                ID <span className="text-red-400">*</span>
              </label>
              <input
                value={form.id}
                onChange={set('id')}
                disabled={isEdit}
                placeholder="z.B. lab100"
                required
                className={`${inputClass} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Name / Beschreibung</label>
              <input value={form.name} onChange={set('name')} placeholder="z.B. Laborserver 1" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Status</label>
              <select value={form.status} onChange={set('status')} className={inputClass}>
                {Object.entries(STATUS_CONFIG).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Hardware</label>
              <textarea
                value={form.hardware}
                onChange={set('hardware')}
                rows={3}
                placeholder="Typ, Modell, Hersteller, Seriennummer …"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Software</label>
              <textarea
                value={form.software}
                onChange={set('software')}
                rows={3}
                placeholder="Betriebssystem, installierte Software, Versionen …"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Standort</label>
              <input value={form.location} onChange={set('location')} placeholder="z.B. Raum A / Regal 3 / Position 2" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Notizen</label>
              <textarea
                value={form.notes}
                onChange={set('notes')}
                rows={3}
                placeholder="Freier Text, Bemerkungen, Zustand …"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex gap-3">
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className={`py-3 px-4 rounded-xl font-medium transition active:scale-95 text-base disabled:opacity-50 ${
                  confirmDelete
                    ? 'bg-red-600 hover:bg-red-500 text-white'
                    : 'bg-slate-700 hover:bg-red-600/20 text-red-400 border border-red-500/30'
                }`}
              >
                {confirmDelete ? 'Wirklich löschen?' : 'Löschen'}
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium transition active:scale-95 text-base disabled:opacity-50"
            >
              {loading ? '…' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
