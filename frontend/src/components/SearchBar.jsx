import { useState, useRef, useEffect } from 'react';
import { api } from '../api';

export function SearchBar({ onResult, onClear }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleChange(e) {
    const val = e.target.value;
    setQuery(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      onClear();
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await api.getDevices(val.trim());
        setSuggestions(results.slice(0, 6));
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 200);
  }

  async function search(id) {
    if (!id.trim()) return;
    setLoading(true);
    setShowSuggestions(false);
    try {
      const device = await api.getDevice(id.trim());
      onResult(device, null);
    } catch (err) {
      onResult(null, err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') search(query);
    if (e.key === 'Escape') { setShowSuggestions(false); onClear(); setQuery(''); }
  }

  function pickSuggestion(device) {
    setQuery(device.id);
    setShowSuggestions(false);
    onResult(device, null);
  }

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <span className="absolute left-4 text-slate-400 pointer-events-none">
          {loading
            ? <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          }
        </span>
        <input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="ID eingeben, z.B. lab100 …"
          className="w-full pl-12 pr-4 py-4 text-lg bg-slate-800 border border-slate-700 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setSuggestions([]); setShowSuggestions(false); onClear(); inputRef.current?.focus(); }}
            className="absolute right-4 text-slate-400 hover:text-slate-200 p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-2 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          {suggestions.map(d => (
            <li key={d.id}>
              <button
                onMouseDown={() => pickSuggestion(d)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-700 text-left transition"
              >
                <span className="font-mono text-blue-400 font-medium">{d.id}</span>
                <span className="text-slate-400 text-sm truncate ml-4">{d.name || d.hardware}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
