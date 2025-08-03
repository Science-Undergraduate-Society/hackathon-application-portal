'use client';

import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
// Styles are in globals.css

export default function LandingPage() {
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    let ui;
    if (!showAuth) return; // only init when modal opens

    import('firebaseui').then((firebaseui) => {
      const uiConfig = {
        signInFlow: 'popup',
        signInOptions: [
          firebase.auth.EmailAuthProvider.PROVIDER_ID,
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
          signInSuccessWithAuthResult: () => {
            router.push('/application/hacker-info');
            return false;
          },
        },
      };
      ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
      ui.start('#firebaseui-auth-container', uiConfig);
    });

    return () => {
      if (ui) ui.delete();
    };
  }, [showAuth, router]);

  return (
    <>
      {/* Dark blue floating orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="orb orb-4"></div>
      <div className="orb orb-5"></div>

      <main>
        <h1>Welcome to the Hackathon Application Portal</h1>
        <button onClick={() => setShowAuth(true)}>
          Continue to Sign In
        </button>
      </main>

      {showAuth && (
        <div className="modal-overlay">
          <div className="modal">
            <button 
              className="close-btn" 
              onClick={() => setShowAuth(false)}
              aria-label="Close modal"
            >
              ×
            </button>
            <div id="firebaseui-auth-container"></div>
          </div>
        </div>
      )}
    </>
  );
}