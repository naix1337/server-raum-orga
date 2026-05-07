const STATUS_CONFIG = {
  produktiv:       { label: 'Produktiv',       classes: 'bg-emerald-500/20 text-emerald-400 ring-emerald-500/30' },
  kundensystem:    { label: 'Kundensystem',     classes: 'bg-blue-500/20 text-blue-400 ring-blue-500/30' },
  nicht_produktiv: { label: 'Nicht Produktiv',  classes: 'bg-slate-500/20 text-slate-400 ring-slate-500/30' },
  veraltet:        { label: 'Veraltet',          classes: 'bg-amber-500/20 text-amber-400 ring-amber-500/30' },
  eingelagert:     { label: 'Eingelagert',       classes: 'bg-violet-500/20 text-violet-400 ring-violet-500/30' },
};

export function StatusBadge({ status, size = 'md' }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.nicht_produktiv;
  const sizeClass = size === 'lg' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center rounded-full font-medium ring-1 ring-inset ${config.classes} ${sizeClass}`}>
      {config.label}
    </span>
  );
}

export { STATUS_CONFIG };
