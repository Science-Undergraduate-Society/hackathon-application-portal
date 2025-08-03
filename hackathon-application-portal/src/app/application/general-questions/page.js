'use client';

import useProfileForm from '../../../hooks/useProfileForm';
import TextAreaField from '../../../components/TextAreaField';

export default function ApplicationQuestionsPage() {
  const initialState = {
    question1: '',
    question2: '',
    question3: ''
  };
  const { form, handleChange, loading, handleNext, handleBack } = useProfileForm(
    initialState,
    '/application/review',       // ← now points to the review page
    '/application/hacker-extra'  // ← back to page 2
  );

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Additional Questions</h1>
      <TextAreaField
        label="Why do you want to attend this hackathon?"
        value={form.question1}
        required
        maxLength={300}
        onChange={handleChange('question1')}
      />
      <TextAreaField
        label="If you could build anything — no constraints, no limits — what would you build?"
        value={form.question2}
        required
        maxLength={300}
        onChange={handleChange('question2')}
      />
      <TextAreaField
        label="Anything else you’d like us to know?"
        value={form.question3}
        maxLength={150}
        onChange={handleChange('question3')}
      />

      <div className="buttons">
        <button type="button" onClick={handleBack}>Back</button>
        <button type="button" onClick={handleNext}>Next</button>
      </div>
    </main>
  );
}
