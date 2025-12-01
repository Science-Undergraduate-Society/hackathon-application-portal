'use client';

import { useRouter } from 'next/navigation';
import SignInModal from '@/components/SignInModal';
import './LandingPage.css'; // regular CSS file

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="landing-container">
      <SignInModal onSuccess={() => router.push('/application/hacker-info')} />

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
