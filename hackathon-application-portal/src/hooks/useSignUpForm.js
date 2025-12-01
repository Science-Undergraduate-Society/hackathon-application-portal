// hooks/useSignupForm.js
import { useState } from 'react';
import { saveUserProfile } from '../services/userService';
import { auth } from '../lib/firebase';
import useAutoSave from './useAutoSave';

export default function useSignupForm(initialState) {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [signUpPage, setSignUpPage] = useState(0);

  // Auto-save only after user is authenticated
  useAutoSave(form, () => {
    const user = auth.currentUser;
    if (user) return saveUserProfile(user.uid, form);
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const saveForm = async () => {
    const user = auth.currentUser;
    if (user) {
      await saveUserProfile(user.uid, form);
    }
  };

  return { 
    form, 
    setForm,
    handleChange, 
    loading, 
    setLoading,
    signUpPage,
    setSignUpPage,
    saveForm
  };
}