export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    padding: '2px',
    borderRadius: '6px',
    border: state.isFocused 
      ? `1px solid var(--text-input-border-focus, #007bff)` 
      : `1px solid var(--text-input-border)`,
    boxShadow: 'none',
    '&:hover': {
      border: state.isFocused 
        ? `1px solid var(--text-input-border-focus, #007bff)` 
        : `1px solid var(--text-input-border)`,
    },
    minHeight: '42px',
    backgroundColor: '#333333',
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: '6px',
    border: `1px solid var(--text-input-border)`,
    backgroundColor: '#333333',
  }),
  option: (provided, state) => ({
    ...provided,
    padding: '10px',
    backgroundColor: state.isFocused 
      ? 'var(--hover-color, #444444)' 
      : '#333333',
    color: 'var(--text-color, #ffffff)',
    cursor: 'pointer',
  }),
  input: (provided) => ({
    ...provided,
    margin: 0,
    padding: 0,
    color: 'var(--text-color, #ffffff)',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: 'var(--text-color, #ffffff)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--placeholder-color, #999999)',
  }),
};