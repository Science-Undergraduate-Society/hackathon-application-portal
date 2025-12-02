'use client';

import SignInModal from '@/components/SignInModal';
import './LandingPage.css';

export default function LandingPage() {
  // Remove the router push - useAuth handles routing now
  const handleSuccess = () => {
    // Optional: you can add any additional logic here
    console.log('Sign in successful');
  };

  return (
    <div className="landing-container">
      <SignInModal onSuccess={handleSuccess} />

      <div className="landing-content">
        <img src="/logo.png" className="landing-logo" />

        <h1 className="landing-title">
          {`HACK\nTHE\nCOAST`}
        </h1>

        <h2 className="landing-subtitle">
          {` Presented by the\nScience\nUndergraduate Society`}
        </h2>
      </div>
    </div>
  );
}