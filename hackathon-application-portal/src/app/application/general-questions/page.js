"use client";

import useProfileForm from "../../../hooks/useProfileForm";
import TextAreaField from "../../../components/TextAreaField";
import "./general-questions.css";
import { ConfirmBtn } from "@/components/CommonUI";
import useAutoClearError from "@/hooks/useAutoClearError";
import WarningDialog from "@/components/warningDialog";
import useIsMobile from "@/hooks/useIsMobile";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ApplicationQuestionsPage() {
  const [error, setError] = useAutoClearError();
  const isMobile = useIsMobile();
  
  const initialState = {
    question1: "",
    question2: "",
    question3: "",
    question4: "",
    question5: "",
  };

  const { form, handleChange, loading, handleNext, handleBack } =
    useProfileForm(
      initialState,
      "/application/terms-and-conditions",
      "/application/hacker-extra",
    );

  const handleSubmit = () => {
    if(!form.question1 || !form.question2 || !form.question3 || !form.question4) {
      setError("Please answer all required questions to proceed.");
    } else {
      handleNext();
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <main>
       <div className="container">
        <div className="title-container">
      <h1>Application Questions</h1>
      </div>
      

      {error && <WarningDialog warningMsg={error} duration={4000} />}

      <div>
        <TextAreaField
          className="sprite-dolphin"
          label="What do you hope to learn from attending this hackathon? Why?"
          value={form.question1}
          required
          maxLength={300}
          onChange={handleChange("question1")}
        />

        <TextAreaField
          label="What is a recent challenge you faced, and how did you approach it?"
          value={form.question2}
          required
          maxLength={300}
          onChange={handleChange("question2")}
        />

        <TextAreaField
          className="sprite-otter-turtle"
          label="Describe the kind of role you play on a team and how it's valuable/beneficial to the team."
          value={form.question3}
          required
          maxLength={300}
          onChange={handleChange("question3")}
        />

        <TextAreaField
          label="What is your favourite body of water? Why? (e.g. pond/ocean/bathtub)"
          value={form.question4}
          required
          maxLength={300}
          onChange={handleChange("question4")}
        />

        <TextAreaField
          className="sprite-whale"
          label="Suggest a song and we'll add it to our hackathon playlist!"
          value={form.question5}
          maxLength={150}
          onChange={handleChange("question5")}
        />

        <div className="buttons">
          <ConfirmBtn 
            onClickFn={handleSubmit} 
            dimension={isMobile ? "sm" : "lg"} 
          />
        </div>
      </div>
       </div>
    </main>
  );
}