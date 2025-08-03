'use client';

export default function TextAreaField({ label, value, required = false, maxLength, onChange }) {
  return (
    <div className="field">
      <label>
        {label}{required && ' *'}
        <textarea
          value={value}
          required={required}
          maxLength={maxLength}
          rows={6}
          onChange={onChange}
        />
        <div>{value.length}/{maxLength}</div>
      </label>
    </div>
  );
}