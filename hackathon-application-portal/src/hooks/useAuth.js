// hooks/useAuth.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { fetchUserProfile, saveUserProfile } from '@/services/userService';
import useAutoClearError from './useAutoClearError';

export default function useAuth(initialFormState) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(true);
  const [form, setForm] = useState(initialFormState);
  const [signUpPage, setSignUpPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useAutoClearError();
  const auth = getAuth();

  // -------------------- Modal controls --------------------
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  // -------------------- Auth listener --------------------
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      try {
        const profile = await fetchUserProfile(user.uid);
        if (profile) setForm(prev => ({ ...prev, ...profile }));
      } catch (err) {
        console.error(err);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  // -------------------- Profile completion check --------------------
  const getFirstIncompletePage = (profile) => {
    if (!profile) return 1;
    const requiredFieldsByPage = {
      1: ['firstName', 'lastName', 'age', 'pronoun'],
      2: ['phoneNumber', 'levelOfStudy', 'school'],
      3: ['hackathons']
    };
    for (const [page, fields] of Object.entries(requiredFieldsByPage)) {
      const incomplete = fields.some(field => !profile[field] || (typeof profile[field] === 'string' && profile[field].trim() === ''));
      if (incomplete) return parseInt(page, 10);
    }
    return null;
  };

  // -------------------- Email Sign In --------------------
  const emailSignIn = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      handlePostSignIn(cred.user);
    } catch (err) {
      setError(err.message || 'Email sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // -------------------- Google Sign In --------------------
  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const cred = await signInWithPopup(auth, provider);
      handlePostSignIn(cred.user);
    } catch (err) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  // -------------------- After sign-in --------------------
const handlePostSignIn = async (user) => {
  try {
    const profile = await fetchUserProfile(user.uid);

    if (profile) {
      if (profile?.hasSubmitted) {
        return router.push('/application/thank-you?duplicate=true');
      }

      const firstIncomplete = getFirstIncompletePage(profile);

      setSignUpPage(firstIncomplete ?? 0); 
      openModal();
      return;
    }

    // CASE 2: No profile exists — new user
    setSignUpPage(1); 
    openModal();
  } catch (err) {
    console.error(err);
    // Worst-case fallback
    setSignUpPage(1);
    openModal();
  }
};

  // -------------------- Page navigation --------------------
  const nextPage = () => setSignUpPage(prev => Math.min(prev + 1, 3));
  const prevPage = () => setSignUpPage(prev => Math.max(prev - 1, 0));

  // -------------------- Save profile --------------------
  const saveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) await saveUserProfile(user.uid, form);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    }
  };

  // -------------------- Form handling --------------------
  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  return {
    modalOpen,
    openModal,
    closeModal,
    form,
    handleChange,
    signUpPage,
    nextPage,
    prevPage,
    saveProfile,
    email,
    setEmail,
    password,
    setPassword,
    emailSignIn,
    googleSignIn,
    loading,
    error
  };
}
