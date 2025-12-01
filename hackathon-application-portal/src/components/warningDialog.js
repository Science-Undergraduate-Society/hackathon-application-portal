'use client';

import { useState, useEffect } from 'react';
import './warningDialog.css';

export default function WarningDialog({ warningMsg, duration = 3000 }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!isVisible) return null;

  return (
    <div className="warning-dialog show">
      <span className="close-icon" onClick={() => setIsVisible(false)}>×</span>
      <span className="text">{warningMsg}</span>
    </div>
  );
}
