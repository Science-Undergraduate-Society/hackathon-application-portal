'use client';

import { useRouter } from 'next/navigation';
import SignInModal from '@/components/SignInModal';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '60px',
        marginTop: '80px',
      }}
    >
      <SignInModal onSuccess={() => router.push('/application/hacker-info')} />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'left',
          alignItems: 'flex-start',
        }}
      >
        <img
          src="/logo.png"
          style={{ width: '140px', marginBottom: '20px' }}
        />

        <h1
          style={{
            fontSize: '96px',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            whiteSpace: 'pre-line',
          }}
        >
          {`HACK\nTHE\nCOAST`}
        </h1>

        <h2
          style={{
            fontSize: '20px',
            fontWeight: 400,
            marginTop: '20px',
            maxWidth: '400px',
            color: '#ddd',
          }}
        >
          Presented by the Science Undergraduate Society
        </h2>
      </div>
    </div>
  );
}
