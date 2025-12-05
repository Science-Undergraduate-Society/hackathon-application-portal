'use client';

import { useSearchParams } from 'next/navigation';
import './thank-you.css';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const isDuplicate = searchParams.get('duplicate') === 'true';

  return (
    <main style={{ textAlign: 'center', padding: '4rem 2rem' }}>

      <h1>Thank you for applying!</h1>
      <p>We have received your application.</p>
      <img className='logo' src="/logo.png" alt="Hack the Coast Logo"/>

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