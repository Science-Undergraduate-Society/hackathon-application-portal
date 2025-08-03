export default function InputField({ label, type = 'text', value, required = false, readOnly = false, onChange }) {
  return (
    <div className="field">
      <label>
        {label}{required && ' *'}
        <input
          type={type}
          value={value}
          required={required}
          readOnly={readOnly}
          onChange={onChange}
        />
      </label>
    </div>
  );
}