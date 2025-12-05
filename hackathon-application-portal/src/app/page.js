'use client';

import Link from 'next/link';
import SignInModal from '@/components/SignInModal';
import './LandingPage.css';
import '../components/Navbar.css';

export default function LandingPage() {
  const handleSuccess = () => {
    console.log('Sign in successful');
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link href="/" className="navbar-logo">
            <img src="/logo.png" alt="Hack the Coast Logo" />
          </Link>
          
          <div className="navbar-links">
            <a 
              href="https://hackathon.susubc.ca" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="navbar-link"
            >
              Hackathon Info
            </a>
            <a 
              href="https://susubc.ca" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="navbar-link"
            >
              susubc.ca
            </a>
          </div>
        </div>
      </nav>
      
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
        </div>
      </div>
    </>
  );
}