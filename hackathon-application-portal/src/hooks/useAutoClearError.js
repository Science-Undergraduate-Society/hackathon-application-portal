import { useState, useEffect } from 'react';

export default function useAutoClearError(initialValue = null, delay = 4000) {
  const [error, setError] = useState(initialValue);

  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => setError(null), delay);
    return () => clearTimeout(timer);
  }, [error, delay]);

  return [error, setError];
}
