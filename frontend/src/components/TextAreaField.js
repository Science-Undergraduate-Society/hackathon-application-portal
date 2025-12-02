'use client';
import './TextAreaField.css'

export default function TextAreaField({ label, value, required = false, maxLength, onChange }) {
  return (
    <div className="field">
      <label>
        {label}{required && ' *'}
          </label>
        <textarea
          value={value}
          required={required}
          maxLength={maxLength}
          onChange={onChange}
        />
        <div>{value.length}/{maxLength}</div>
    
    </div>
  );
}