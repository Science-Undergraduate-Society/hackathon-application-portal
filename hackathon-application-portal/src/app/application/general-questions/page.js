'use client';

import useProfileForm from '../../../hooks/useProfileForm';
import TextAreaField from '../../../components/TextAreaField';

export default function ApplicationQuestionsPage() {
  const initialState = {
    question1: '',
    question2: '',
    question3: ''
  };
  const { form, handleChange, loading, handleBack } = useProfileForm(
    initialState,
    null,
    '/application/hacker-extra'
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: implement final submission logic
  };

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Additional Questions</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="button" onClick={handleBack}>Back</button>
        <button type="submit">Submit</button>
      </form>
    </main>
  );
}