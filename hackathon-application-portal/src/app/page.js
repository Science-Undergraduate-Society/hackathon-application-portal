'use client';

import { useEffect, useState } from 'react';
import firebase from 'firebase/compat/app';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';

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
      <main>
        <h1>Welcome to the Hackathon Application Portal</h1>
        <button onClick={() => setShowAuth(true)}>
          Continue to Sign In
        </button>
      </main>

      {showAuth && (
        <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)'}}>
          <div className="modal" style={{background: '#fff', margin: '10% auto', padding: '2rem', maxWidth: '400px', position: 'relative'}}>
            <button onClick={() => setShowAuth(false)} style={{position: 'absolute', top: '1rem', right: '1rem'}}>
              ×
            </button>
            <div id="firebaseui-auth-container"></div>
          </div>
        </div>
      )}
    </>
  );
}