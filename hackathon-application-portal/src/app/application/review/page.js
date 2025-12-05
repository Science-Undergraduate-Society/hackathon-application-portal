'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '../../../services/userService';
import { appendToSheet } from '../../../lib/sheets';
import useAutoClearError from '@/hooks/useAutoClearError';
import WarningDialog from '@/components/warningDialog';
import { saveUserProfile } from '../../../services/userService';
import './review.css';

export default function ReviewPage() {
  const [data, setData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useAutoClearError();
  const router = useRouter();

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      const usr = auth.currentUser;
      if (!usr) {
        router.push('/');
        return;
      }

      const profile = await fetchUserProfile(usr.uid);
      
      if (profile.hasSubmitted) {
        router.push('/application/thank-you?duplicate=true');
        return;
      }
      
      setData(profile);
    };

    checkSubmissionStatus();

    // Also listen for auth changes
    let unsub;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, async (usr) => {
        if (!usr) {
          router.push('/');
          return;
        }
        const profile = await fetchUserProfile(usr.uid);
        
        if (profile.hasSubmitted) {
          router.push('/application/thank-you?duplicate=true');
          return;
        }
        
        setData(profile);
      });
    });

    return () => unsub && unsub();
  }, [router]);

  if (!data) return <div>Loading...</div>;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const usr = auth.currentUser;

      if (!usr) throw new Error('Not authenticated');
      
      const freshData = await fetchUserProfile(usr.uid);

      if (freshData.hasSubmitted) {
        router.push('/application/thank-you?duplicate=true');
        return;
      }

      const row = [
        freshData.firstName,
        freshData.lastName,
        freshData.preferredName,
        freshData.email,
        freshData.pronounsOther
          ? `${freshData.pronouns} (${freshData.pronounsOther})`
          : freshData.pronouns,
        freshData.phone,
        freshData.country,
        freshData.dietaryRestrictions,
        freshData.schoolOther
          ? `${freshData.school} (${freshData.schoolOther})`
          : freshData.school,
        freshData.graduationYearOther
          ? `${freshData.graduationYear} (${freshData.graduationYearOther})`
          : freshData.graduationYear,
        freshData.levelOfStudy,
        freshData.fieldOfStudy,
        freshData.firstTimeHacker,
        freshData.resumeLink,
        freshData.githubLink,
        freshData.question1,
        freshData.question2,
        freshData.question3
      ];
      
      await appendToSheet(row);
      await saveUserProfile(usr.uid, { ...freshData, hasSubmitted: true });

      router.push('/application/thank-you');
    } catch (error) {
      console.error('Error submitting to Google Sheets', error);
      setError('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {error && <WarningDialog warningMsg={error} duration={4000} />}
      
      <h1>Review Your Application</h1>

      <button onClick={() => router.push('/application/hacker-info')}>Edit</button>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </main>
  );
}