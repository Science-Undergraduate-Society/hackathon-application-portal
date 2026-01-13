'use client';

import Navbar from '@/components/Navbar';
import SignInModal from '@/components/SignInModal';
import './LandingPage.css';
import '../components/Navbar.css';
import ApplicationClosedModal from '@/components/closed/closedModal';

export default function LandingPage() {
  const handleSuccess = () => {
    console.log('Sign in successful');
  };

  return (
    <>
      <Navbar />
      <div className="landing-container">
        <ApplicationClosedModal/>
      </div>
    </>
  );
}