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
    if (user) {
      // Clean react-select values before auto-saving
      const cleanedForm = cleanSelectValues(form);
      return saveUserProfile(user.uid, cleanedForm);
    }
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  // Helper to clean react-select objects
  const cleanSelectValues = (data) => {
    return {
      ...data,
      age: data.age ? { label: data.age.label, value: data.age.value } : null,
      pronoun: data.pronoun ? { label: data.pronoun.label, value: data.pronoun.value } : null,
      levelOfStudy: data.levelOfStudy ? { label: data.levelOfStudy.label, value: data.levelOfStudy.value } : null,
      school: data.school ? { label: data.school.label, value: data.school.value } : null,
      hearAbout: data.hearAbout ? { label: data.hearAbout.label, value: data.hearAbout.value } : null,
    };
  };

  const saveForm = async (dataToSave) => {
    const user = auth.currentUser;
    if (user) {
      // Use provided data or fall back to current form state
      const dataToClean = dataToSave || form;
      const cleanedData = cleanSelectValues(dataToClean);
      await saveUserProfile(user.uid, cleanedData);
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