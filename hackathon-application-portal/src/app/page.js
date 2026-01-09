'use client';

import Navbar from '@/components/Navbar';
import SignInModal from '@/components/SignInModal';
import './LandingPage.css';
import '../components/Navbar.css';

export default function LandingPage() {
  const handleSuccess = () => {
    console.log('Sign in successful');
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <SignInModal onSuccess={handleSuccess} />

        <div className="landing-content">
          <img src="/logo.svg" alt="Hack the Coast Logo" className="landing-logo" />

          <h1 className="landing-title">
            {`HACK\nTHE\nCOAST`}
          </h1>

          <h2 className="landing-subtitle">
            {` Presented by the\nScience Undergraduate Society`}
          </h2>

          <h3 className="due-date">
            Applications closing January 9, 2026!
          </h3>
        </div>
      </div>
    </>
  );
}