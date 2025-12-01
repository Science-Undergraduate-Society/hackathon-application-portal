import React, { useState } from 'react';
import './SignInModal.css';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';

export default function SignInModal({ onSuccess }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [incompleteProfilePage, setIncompleteProfilePage] = useState(null);

  // When a user signs in with incomplete profile, switch to signup form
  const handleIncompleteProfile = (page) => {
    setIncompleteProfilePage(page);
    setActiveIndex(1); // Switch to "New Here?" tab (SignUpForm)
  };

  return (
    <div className="modal-box">
      <div className="tab-buttons">
        <div
          className={`tab-button ${activeIndex === 0 ? 'active' : ''}`}
          onClick={() => setActiveIndex(0)}
        >
          Welcome Back!
        </div>
        <div
          className={`tab-button ${activeIndex === 1 ? 'active' : ''}`}
          onClick={() => setActiveIndex(1)}
        >
          New Here?
        </div>
      </div>

      <div className="modal-content">
        {activeIndex === 0 ? (
          <SignInForm 
            onSuccess={onSuccess} 
            onIncompleteProfile={handleIncompleteProfile}
          />
        ) : (
          <SignUpForm 
            onSuccess={onSuccess}
            initialPage={incompleteProfilePage}
          />
        )}
      </div>
    </div>
  );
}