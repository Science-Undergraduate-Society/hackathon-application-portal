'use client';

export default function Dropdown({ label, options, value, otherValue, required = false, onChange, onOtherChange }) {
  return (
    <div className="field">
      <label>
        {label}{required && ' *'}
        <select value={value} required={required} onChange={onChange}>
          <option value="">Select...</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </label>
      {value === 'other' && (
        <input placeholder="Please specify" value={otherValue} onChange={onOtherChange} />
      )}
    </div>
  );
}
