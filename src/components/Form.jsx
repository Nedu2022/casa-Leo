// Modern form controls shared by the filters, contact form and purchase flow.

export function Field({ label, as = 'input', className = '', children, ...props }) {
  const Tag = as
  return (
    <label className={`field ${className}`}>
      <Tag className="field-input" placeholder=" " {...props}>{children}</Tag>
      <span className="field-label">{label}</span>
    </label>
  )
}

export function Segmented({ options, value, onChange, className = '' }) {
  return (
    <div role="radiogroup" className={`inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-stone-100 p-1 [scrollbar-width:none] ${className}`}>
      {options.map(([v, label]) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-medium transition ${value === v ? 'bg-white text-ink shadow-[0_1px_4px_rgba(28,25,23,0.12)]' : 'text-stone-500 hover:text-ink'}`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export function Range({ value, min, max, step = 1, onChange, label }) {
  const p = ((value - min) / (max - min)) * 100
  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      className="range"
      style={{ '--p': `${p}%` }}
    />
  )
}
