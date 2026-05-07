import { useState, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { DeviceCard } from './components/DeviceCard';
import { DeviceForm } from './components/DeviceForm';
import { DeviceList } from './components/DeviceList';

export default function App() {
  const [device, setDevice] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [editDevice, setEditDevice] = useState(null);

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') { setShowForm(false); setShowList(false); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  function handleSearchResult(found, err) {
    setDevice(found);
    setError(err || '');
  }

  function handleFormSave(saved) {
    setDevice(saved);
    setShowForm(false);
    setEditDevice(null);
  }

  function handleFormDelete() {
    setDevice(null);
    setShowForm(false);
    setEditDevice(null);
  }

  function openEdit() {
    setEditDevice(device);
    setShowForm(true);
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-slate-100 tracking-tight">Server Inventar</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowList(true)}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-xl transition"
          >
            Alle anzeigen
          </button>
          <button
            onClick={() => { setEditDevice(null); setShowForm(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Neu
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-4 pt-12 pb-8 gap-6">
        <div className="w-full max-w-xl">
          <h1 className="text-center text-3xl font-bold text-slate-100 mb-2 tracking-tight">
            Gerät suchen
          </h1>
          <p className="text-center text-slate-500 text-sm mb-8">
            ID eingeben und Enter drücken
          </p>
          <SearchBar
            onResult={handleSearchResult}
            onClear={() => { setDevice(null); setError(''); }}
          />
        </div>

        {error && (
          <div className="w-full max-w-xl px-6 py-4 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 text-center">
            {error}
          </div>
        )}

        {device && (
          <DeviceCard
            device={device}
            onEdit={openEdit}
            onUpdate={setDevice}
          />
        )}
      </main>

      {showForm && (
        <DeviceForm
          device={editDevice}
          onSave={handleFormSave}
          onDelete={handleFormDelete}
          onClose={() => { setShowForm(false); setEditDevice(null); }}
        />
      )}

      {showList && (
        <DeviceList
          onSelect={(d) => { setDevice(d); setError(''); }}
          onClose={() => setShowList(false)}
        />
      )}
    </div>
  );
}
