import { useEffect } from 'react';

export default function useAutoSave(form, saveFn) {
  useEffect(() => {
    const timer = setTimeout(() => {
      saveFn();
    }, 500);
    return () => clearTimeout(timer);
  }, [form, saveFn]);
}