'use client';

import InputField from '../../../components/InputField';
import Dropdown from '../../../components/Dropdown';
import useProfileForm from '../../../hooks/useProfileForm';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function HackerInfoPage() {
  const initialState = {
    firstName: '', lastName: '', preferredName: '', email: '',
    pronouns: '', pronounsOther: '', phone: '', country: '', dietaryRestrictions: ''
  };
  const { form, handleChange, loading, handleNext } = useProfileForm(
    initialState,
    '/application/hacker-extra'
  );

  if (loading) return <LoadingSpinner />;

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
        options={[ 'None', 'Vegetarian', 'Vegan', 'Gluten-free' ]}
        value={form.dietaryRestrictions}
        onChange={handleChange('dietaryRestrictions')}
      />
      <button onClick={handleNext}>Next</button>
    </main>
  );
}