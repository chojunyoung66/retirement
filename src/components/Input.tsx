interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  placeholder?: string;
  suffix?: string;
  error?: string;
  hint?: string;
}

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  suffix,
  error,
  hint,
}: InputProps) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div className="form-input-wrap">
        <input
          className={`form-input${suffix ? ' has-suffix' : ''}`}
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          inputMode={type === 'number' ? 'numeric' : 'text'}
        />
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {hint && !error && <div className="form-hint">{hint}</div>}
      {error && <div className="form-error">{error}</div>}
    </div>
  );
}
