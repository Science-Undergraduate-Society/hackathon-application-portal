'use client';

import InputField from '../../../components/InputField';
import Dropdown from '../../../components/Dropdown';
import useProfileForm from '../../../hooks/useProfileForm';
import LoadingSpinner from '../../../components/LoadingSpinner';

export default function HackerProfilePage() {
  const initialState = {
    school: '', schoolOther: '', graduationYear: '', graduationYearOther: '',
    levelOfStudy: '', fieldOfStudy: '', firstTimeHacker: '', resumeLink: '', githubLink: ''
  };
  const { form, handleChange, loading, handleNext, handleBack } = useProfileForm(
    initialState,
    '/application/general-questions',
    '/application/hacker-info'
  );

  if (loading) return <LoadingSpinner />;

  return (
    <main>
      <h1>Hacker Profile</h1>
      <Dropdown
        label="School / University Name"
        options={[
          'University of British Columbia', 'University of Toronto', 'McGill University',
          'University of Waterloo', "Queen's University", 'University of Alberta',
          'McMaster University', 'Simon Fraser University', 'BCIT', 'Langara College',
          'Douglas College', 'Capilano University', 'Kwantlen Polytechnic University',
          'Vancouver Community College', 'Other'
        ]}
        value={form.school}
        required
        onChange={handleChange('school')}
        otherValue={form.schoolOther}
        onOtherChange={handleChange('schoolOther')}
      />
      <Dropdown
        label="Graduation Year"
        options={[ '2025', '2026', '2027', '2028', 'Other' ]}
        value={form.graduationYear}
        required
        onChange={handleChange('graduationYear')}
        otherValue={form.graduationYearOther}
        onOtherChange={handleChange('graduationYearOther')}
      />
      <Dropdown
        label="Level of Study"
        options={[ 'High School', 'Undergraduate', 'Graduate', 'Bootcamp', 'Not currently a student' ]}
        value={form.levelOfStudy}
        required
        onChange={handleChange('levelOfStudy')}
      />
      <InputField label="Field of Study / Major" value={form.fieldOfStudy} onChange={handleChange('fieldOfStudy')} />
      <fieldset>
        <legend>First-Time Hacker? *</legend>
        <label><input type="radio" name="firstTimeHacker" value="yes" checked={form.firstTimeHacker==='yes'} onChange={handleChange('firstTimeHacker')} /> Yes</label>
        <label><input type="radio" name="firstTimeHacker" value="no" checked={form.firstTimeHacker==='no'} onChange={handleChange('firstTimeHacker')} /> No</label>
      </fieldset>
      <InputField
        label="Resume (Google Drive Link)"
        type="url"
        placeholder="https://drive.google.com/file/d/your-resume-id/view"
        value={form.resumeLink}
        onChange={handleChange('resumeLink')}
      />
      <InputField
        label="GitHub / Portfolio Link"
        type="url"
        value={form.githubLink}
        onChange={handleChange('githubLink')}
      />
      <button onClick={handleBack}>Back</button>
      <button onClick={handleNext}>Next</button>
    </main>
  );
}