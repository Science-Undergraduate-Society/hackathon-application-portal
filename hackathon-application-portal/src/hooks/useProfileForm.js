import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { fetchUserProfile, saveUserProfile } from '../services/userService';
import useAutoSave from './useAutoSave';

export default function useProfileForm(initialState, nextRoute, prevRoute = null) {
  const router = useRouter();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;
    import('firebase/auth').then(({ onAuthStateChanged }) => {
      unsubscribe = onAuthStateChanged(auth, async (usr) => {
        if (!usr) {
          router.push('/');
          return;
        }
        const profile = await fetchUserProfile(usr.uid);
        setForm({ ...initialState, ...profile });
        setLoading(false);
      });
    });
    return () => { if (unsubscribe) unsubscribe(); };
  }, [router]);

  useAutoSave(form, () => {
    const user = auth.currentUser;
    if (user) return saveUserProfile(user.uid, form);
  });

  const handleChange = field => e => setForm(prev => ({ ...prev, [field]: e.target.value }));
  const handleNext = async () => {
    const user = auth.currentUser;
    if (user) await saveUserProfile(user.uid, form);
    router.push(nextRoute);
  };
  const handleBack = () => prevRoute && router.push(prevRoute);

  return { form, handleChange, loading, handleNext, handleBack };
}
