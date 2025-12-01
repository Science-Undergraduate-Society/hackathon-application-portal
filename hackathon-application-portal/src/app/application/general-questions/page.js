"use client";

import useProfileForm from "../../../hooks/useProfileForm";
import TextAreaField from "../../../components/TextAreaField";
import "./general-questions.css";
import { ConfirmBtn, ForwardBtn } from "@/components/CommonUI";

export default function ApplicationQuestionsPage() {
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

  if (loading) return <div>Loading...</div>;

  return (
    <main>
      <h1>Application Questions</h1>

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
          <ConfirmBtn onClickFn={handleNext} dimension={"lg"}></ConfirmBtn>{" "}
        </div>

      </div>

      
    </main>
  );
}
