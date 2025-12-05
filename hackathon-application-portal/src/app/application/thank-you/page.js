'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './thank-you.css';

function ThankYouContent() {
  const searchParams = useSearchParams();
  const isDuplicate = searchParams.get('duplicate') === 'true';

  return (
    <main style={{ textAlign: 'center', padding: '4rem 2rem' }}>

      <h1>Thank you for applying!</h1>
      <p>We have received your application.</p>

      <img src="/logo.svg" alt="Hack the Coast Logo" className='logo' />

      <div className='message-container'>
        {isDuplicate ? (
          <>
            We have already received your application. 
            You will receive an email once we review it. Please keep an eye on your inbox!
          </>
        ) : (
          <>
            You will receive an email once we review your application. Please keep an eye on your inbox!
          </>
        )}
      </div>
    </main>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense fallback={
      <main style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1>Thank you for applying!</h1>
        <p>Loading...</p>
      </main>
    }>
      <ThankYouContent />
    </Suspense>
  );
}