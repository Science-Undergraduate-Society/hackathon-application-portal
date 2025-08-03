'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import { fetchUserProfile } from '../../../services/userService';
import { appendToSheet } from '../../../lib/sheets';

export default function ReviewPage() {
  const [data, setData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let unsub;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, async (usr) => {
        if (!usr) return router.push('/');
        const profile = await fetchUserProfile(usr.uid);
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
      router.push('/application/thank-you');
    } catch (error) {
      console.error('Error submitting to Google Sheets', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      <h1>Review Your Application</h1>

      <section>
        <h2>General Information</h2>
        <p><strong>First Name:</strong> {data.firstName}</p>
        <p><strong>Last Name:</strong> {data.lastName}</p>
        <p><strong>Preferred Name:</strong> {data.preferredName}</p>
        <p><strong>Email:</strong> {data.email}</p>
        <p><strong>Pronouns:</strong> {data.pronounsOther ? `${data.pronouns} (${data.pronounsOther})` : data.pronouns}</p>
        <p><strong>Phone:</strong> {data.phone}</p>
        <p><strong>Country:</strong> {data.country}</p>
        <p><strong>Dietary Restrictions:</strong> {data.dietaryRestrictions}</p>
      </section>

      <section>
        <h2>Hacker Profile</h2>
        <p><strong>School / University:</strong> {data.schoolOther ? `${data.school} (${data.schoolOther})` : data.school}</p>
        <p><strong>Graduation Year:</strong> {data.graduationYearOther ? `${data.graduationYear} (${data.graduationYearOther})` : data.graduationYear}</p>
        <p><strong>Level of Study:</strong> {data.levelOfStudy}</p>
        <p><strong>Field of Study / Major:</strong> {data.fieldOfStudy}</p>
        <p><strong>First-Time Hacker:</strong> {data.firstTimeHacker === 'yes' ? 'Yes' : 'No'}</p>
        <p><strong>Resume Link:</strong> <a href={data.resumeLink} target="_blank" rel="noopener noreferrer">{data.resumeLink}</a></p>
        <p><strong>GitHub / Portfolio:</strong> <a href={data.githubLink} target="_blank" rel="noopener noreferrer">{data.githubLink}</a></p>
      </section>

      <section>
        <h2>Additional Questions</h2>
        <p><strong>Why attend:</strong> {data.question1}</p>
        <p><strong>Dream build:</strong> {data.question2}</p>
        <p><strong>Other info:</strong> {data.question3}</p>
      </section>

      <button onClick={() => router.push('/application/hacker-info')}>Edit</button>
      <button onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit'}
      </button>
    </main>
  );
}