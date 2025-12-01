'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./SignUpForm.css";
import { BackwardBtn, ForwardBtn, UploadBtn } from "./CommonUI";
import WarningDialog from "./warningDialog";
import useAutoClearError from "@/hooks/useAutoClearError";
import useSignupForm from "@/hooks/useSignUpForm";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import Select from "react-select";
import Creatable from "react-select/creatable";
import { ages } from "@/data/ages";
import { levelsOfStudy } from "@/data/levelOfStudy";
import { pronouns } from "@/data/pronouns";
import { schools } from "@/data/schools";
import { customSelectStyles } from "@/styles/selectStyles";
import { howDidYouHear } from "@/data/hearAboutUs";

const initialFormState = {
  firstName: "",
  lastName: "",
  age: null,
  pronoun: null,
  phoneNumber: "",
  year: "",
  levelOfStudy: null,
  school: null,
  hackathons: "",
  dietaryRestrictions: "",
  hearAbout: null,
  resume: null,
};

export function SignUpForm({ onSuccess }) {
  const router = useRouter();
  const [error, setError] = useAutoClearError();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const {
    form: formData,
    handleChange: handleInputChange,
    loading,
    setLoading,
    signUpPage,
    setSignUpPage,
    saveForm,
  } = useSignupForm(initialFormState);

  // ---------------- Google Signup ----------------
  const handleGoogleSignup = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      setLoading(true);
      await signInWithPopup(auth, provider);
      setSignUpPage(1); // skip email/password and go to Name/Age/Pronouns
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Email/Password Signup ----------------
  // Helper function to clean react-select objects for Firebase
  const cleanSelectValue = (value) => {
    if (!value) return null;
    // Remove __isNew__ and other internal properties
    const { __isNew__, ...cleanValue } = value;
    return cleanValue;
  };

  const handleNextPage = async () => {
    if (signUpPage === 0) {
      if (email && password) {
        try {
          setLoading(true);
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, email, password);
          setSignUpPage(1);
        } catch (err) {
          setError(err.message || "Email sign-up failed");
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please enter email and password");
      }
    } else if (signUpPage === 1) {
      // Check if all fields have values (including custom created options)
      if (formData.firstName && formData.lastName && formData.age && formData.pronoun) {
        setSignUpPage(2);
      } else {
        setError("Please fill in all required fields");
      }
    } else if (signUpPage === 2) {
      if (formData.year && formData.phoneNumber && formData.levelOfStudy && formData.school) {
        setSignUpPage(3);
      } else {
        setError("Please fill in all required fields");
      }
    }
  };

  const handlePreviousPage = () => {
    if (signUpPage > 0) setSignUpPage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.hackathons) {
      setError("Please fill in all required fields");
      return;
    }
    
    // saveForm now handles cleaning internally
    await saveForm();
    router.push("/application/general-questions");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    handleInputChange("resume", file);
  };

  const handleResumeUpload = () => {
    document.getElementById("resume-upload").click();
  };

  return (
    <div className="signup-container">
      {error && <WarningDialog warningMsg={error} duration={4000} />}

      {/* ---------------- Page 0: Signup Method ---------------- */}
      {signUpPage === 0 && (
        <div className="formfields-container">
          <h2>Create Account</h2>

          <button className="google-btn" onClick={handleGoogleSignup}>
            <img src="/google.png" alt="Google" />
            Continue with Google
          </button>

          <div className="divider"></div>

          <div className="form-field">
            <h3>Email*</h3>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Password*</h3>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 1: Name, Age, Pronouns ---------------- */}
      {signUpPage === 1 && (
        <div className="formfields-container">
          <h2>Personal Info</h2>

          <div className="form-field">
            <h3>First Name*</h3>
            <input
              className="input-field"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Last Name*</h3>
            <input
              className="input-field"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Age*</h3>
            <Select
              options={ages}
              styles={customSelectStyles}
              value={formData.age}
              onChange={(selectedOption) =>
                handleInputChange("age", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3>Pronouns*</h3>
            <Creatable
              options={pronouns}
              styles={customSelectStyles}
              formatCreateLabel={(inputValue) => `Other: ${inputValue}`}
              value={formData.pronoun}
              onChange={(selectedOption) =>
                handleInputChange("pronoun", selectedOption)
              }
              isClearable
            />
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
            <BackwardBtn onClickFn={handlePreviousPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 2: Phone, Year, Level, School ---------------- */}
      {signUpPage === 2 && (
        <div className="formfields-container">
          <h2>Profile Details</h2>

          <div className="form-field">
            <h3>Phone Number*</h3>
            <input
              className="input-field"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Year*</h3>
            <input
              className="input-field"
              value={formData.year}
              onChange={(e) => handleInputChange("year", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Level Of Study*</h3>
            <Select
              options={levelsOfStudy}
              styles={customSelectStyles}
              value={formData.levelOfStudy}
              onChange={(selectedOption) =>
                handleInputChange("levelOfStudy", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3>School*</h3>
            <Select
              options={schools}
              styles={customSelectStyles}
              value={formData.school}
              onChange={(selectedOption) =>
                handleInputChange("school", selectedOption)
              }
            />
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
            <BackwardBtn onClickFn={handlePreviousPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 3: Hackathons, Dietary, Resume ---------------- */}
      {signUpPage === 3 && (
        <div className="formfields-container">
          <h2>Additional Info</h2>

          <div className="form-field">
            <h3>How many hackathons have you attended in the past?*</h3>
            <input
              className="input-field"
              value={formData.hackathons}
              onChange={(e) => handleInputChange("hackathons", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3>Do you have any dietary restrictions?</h3>
            <input
              className="input-field"
              value={formData.dietaryRestrictions}
              onChange={(e) =>
                handleInputChange("dietaryRestrictions", e.target.value)
              }
            />
          </div>

          <div className="form-field">
            <h3>Where did you hear about us?</h3>
            <Select
              options={howDidYouHear}
              styles={customSelectStyles}
              value={formData.hearAbout}
              onChange={(selectedOption) =>
                handleInputChange("hearAbout", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3>Upload your resume</h3>
            <input
              id="resume-upload"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
            />
            <UploadBtn onClickFn={handleResumeUpload} dimension="sm" />
            {formData.resume && <span className="file-name">{formData.resume.name}</span>}
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleSubmit} dimension="sm" />
            <BackwardBtn onClickFn={handlePreviousPage} dimension="sm" />
          </div>
        </div>
      )}
    </div>
  );
}