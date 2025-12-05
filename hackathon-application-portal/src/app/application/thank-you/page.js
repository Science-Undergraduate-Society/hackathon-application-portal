import './thank-you.css';

export default function ThankYouPage() {
  return (
    <main style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1>Thank you for applying!</h1>
      <p>We have received your application.</p>

      <img src="/logo.svg" alt="Hack the Coast Logo" className='logo' />

      <div className='message-container'>
        You will receive an email once we review your application. Please keep an eye on your inbox!
      </div>
    </main>
  );
}