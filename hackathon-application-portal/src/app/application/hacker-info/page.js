'use client';

import { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';
import { useRouter } from 'next/navigation';
import InputField from '../../../components/InputField';
import Dropdown from '../../../components/Dropdown';
import useAutoSave from '../../../hooks/useAutoSave';
import { saveUserProfile, fetchUserProfile } from '../../../services/userService';

export default function HackerInfoPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    preferredName: '',
    email: '',
    pronouns: '',
    pronounsOther: '',
    phone: '',
    country: '',
    dietaryRestrictions: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirect or load profile once auth state is known
    const unsubscribe = import('firebase/auth').then(({ onAuthStateChanged }) =>
      onAuthStateChanged(auth, async (usr) => {
        if (!usr) {
          router.push('/');
          return;
        }
        try {
          const profile = await fetchUserProfile(usr.uid);
          setForm({
            firstName: profile?.firstName || '',
            lastName: profile?.lastName || '',
            preferredName: profile?.preferredName || '',
            email: profile?.email || usr.email || '',
            pronouns: profile?.pronouns || '',
            pronounsOther: profile?.pronounsOther || '',
            phone: profile?.phone || '',
            country: profile?.country || '',
            dietaryRestrictions: profile?.dietaryRestrictions || ''
          });
        } finally {
          setLoading(false);
        }
      })
    );

    return () => {
      unsubscribe.then(fn => fn && fn());
    };
  }, [router]);

  // Auto-save whenever form changes
  useAutoSave(form, () => {
    const user = auth.currentUser;
    if (user) return saveUserProfile(user.uid, form);
  });

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) await saveUserProfile(user.uid, form);
    router.push('/application/hacker-extra');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>General Information</h1>
      <InputField label="First Name" value={form.firstName} required onChange={handleChange('firstName')} />
      <InputField label="Last Name" value={form.lastName} required onChange={handleChange('lastName')} />
      <InputField label="Preferred Name / Nickname" value={form.preferredName} onChange={handleChange('preferredName')} />
      <InputField label="Email Address" type="email" value={form.email} required onChange={handleChange('email')} />
      <Dropdown
        label="Pronouns"
        options={[ 'she/her', 'he/him', 'they/them', 'prefer not to say', 'other' ]}
        value={form.pronouns}
        otherValue={form.pronounsOther}
        onChange={handleChange('pronouns')}
        onOtherChange={handleChange('pronounsOther')}
      />
      <InputField label="Phone Number" value={form.phone} onChange={handleChange('phone')} />
      <InputField label="Country of Residence" value={form.country} required onChange={handleChange('country')} />
      <Dropdown
        label="Dietary Restrictions"
        options={[ 'None', 'Vegetarian', 'Vegan', 'Gluten-free', 'Other' ]}
        value={form.dietaryRestrictions}
        otherValue=""
        onChange={handleChange('dietaryRestrictions')}
        onOtherChange={() => {}}
      />
      <button onClick={handleNext}>Next</button>
    </main>
  );
}