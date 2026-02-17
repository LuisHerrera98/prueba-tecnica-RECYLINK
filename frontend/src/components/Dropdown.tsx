import { useState, useRef, useEffect } from 'react';

interface Option {
  label: string;
  value: string;
}

interface Props {
  options: Option[];
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

export default function Dropdown({ options, value, placeholder, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className={`dropdown__trigger ${open ? 'dropdown__trigger--open' : ''}`}
        onClick={() => setOpen(!open)}
      >
        <span className={value ? '' : 'dropdown__placeholder'}>{selectedLabel}</span>
        <svg width="12" height="12" viewBox="0 0 12 12">
          <path fill="currentColor" d="M6 8L1 3h10z" />
        </svg>
      </button>

      {open && (
        <ul className="dropdown__menu">
          <li
            className={`dropdown__item ${!value ? 'dropdown__item--active' : ''}`}
            onClick={() => handleSelect('')}
          >
            {placeholder}
          </li>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`dropdown__item ${opt.value === value ? 'dropdown__item--active' : ''}`}
              onClick={() => handleSelect(opt.value)}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
