import React from 'react';
import "./EmailAndPassword.css"


export default function EmailAndPassword({ formData, handleInputChange }) {
  return (
    <div className="email-password-container">
      <input 
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        className="input-field"
        placeholder="Email"
      />
      <input 
        type="password"
        value={formData.password}
        onChange={(e) => handleInputChange('password', e.target.value)}
        className="input-field"
        placeholder="Password"
      />
    </div>
  );
}
