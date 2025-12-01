// hooks/useSignUpForm.js
import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { saveUserProfile } from '@/services/userService';
import { uploadFile } from '@/services/fileUploadService';

export default function useSignupForm(initialFormState) {
  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [signUpPage, setSignUpPage] = useState(0);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const cleanSelectValue = (value) => {
    if (!value) return null;
    const { __isNew__, ...cleanValue } = value;
    return cleanValue;
  };

  const saveForm = async () => {
  try {
    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Clean the form data
    const cleanedForm = {
      ...form,
      age: cleanSelectValue(form.age),
      pronoun: cleanSelectValue(form.pronoun),
      levelOfStudy: cleanSelectValue(form.levelOfStudy),
      school: cleanSelectValue(form.school),
      hearAbout: cleanSelectValue(form.hearAbout),
      // waiverLink and resumeLink are already strings, no need to process
    };

    await saveUserProfile(user.uid, cleanedForm);
  } catch (error) {
    console.error('Error saving form:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

  return {
    form,
    handleChange,
    loading,
    setLoading,
    signUpPage,
    setSignUpPage,
    saveForm,
  };
}