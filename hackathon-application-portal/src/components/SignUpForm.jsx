'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./SignUpForm.css";
import { BackwardBtn, ForwardBtn } from "./CommonUI";
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
  waiverLink: "",  
  resumeLink: "",  
};

export function SignUpForm({ onSuccess, initialPage = 0 }) {
  const router = useRouter();
  const [error, setError] = useAutoClearError();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMinor, setIsMinor] = useState(false);

  const {
    form: formData,
    handleChange: handleInputChange,
    loading,
    setLoading,
    signUpPage,
    setSignUpPage,
    saveForm,
  } = useSignupForm(initialFormState);

  // Set initial page if user has incomplete profile
  React.useEffect(() => {
    if (initialPage !== null && initialPage > 0) {
      setSignUpPage(initialPage);
    }
  }, [initialPage]);

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
      if (formData.firstName && formData.lastName && formData.age && formData.pronoun && formData.waiverLink) {
        if (formData.waiverLink && !isValidGoogleDriveLink(formData.waiverLink)) {
        setError("Please provide a valid Google Drive link for the waiver");
        return;
      }

        setSignUpPage(2);
      } else {
        setError("Please fill in all required fields");
      }
    } else if (signUpPage === 2) {
      if (formData.year && formData.phoneNumber && formData.levelOfStudy && formData.school) {
        if (formData.resumeLink && !isValidGoogleDriveLink(formData.resumeLink)) {
        setError("Please provide a valid Google Drive link for the resume");
        return;
      }

        setSignUpPage(3);
      } else {
        setError("Please fill in all required fields");
      }
    }
  };

  const handleAgeChange = (selectedOption) => {
    console.log(selectedOption);
    // Check if age value indicates minor (adjust based on your ages data structure)
    if (selectedOption?.value === "lt-18") {
      setIsMinor(true);
    } else {
      setIsMinor(false);
    }
    handleInputChange("age", selectedOption);
  };

  const isValidGoogleDriveLink = (url) => {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

  const handlePreviousPage = () => {
    if (signUpPage > 0) setSignUpPage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!formData.hackathons) {
      setError("Please fill in all required fields");
      return;
    }
    
    await saveForm();
    router.push("/application/general-questions");
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

    {/* Age and Pronouns side by side */}
    <div className="field-group">
      <div className="form-field-half">
        <h3>Age*</h3>
        <Select
          options={ages}
          styles={customSelectStyles}
          value={formData.age}
          onChange={handleAgeChange}
        />
      </div>

      <div className="form-field-half">
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
    </div>

    {/* Waiver Google Drive Link */}
    <div className="form-field">
      <h3>Waiver Google Drive Link{isMinor ? ' (with guardian signature)*' : '*'}</h3>
      <input
        className="input-field"
        type="url"
        placeholder="https://drive.google.com/file/d/..."
        value={formData.waiverLink || ""}
        onChange={(e) => handleInputChange("waiverLink", e.target.value)}
      />
      <small style={{ fontSize: '1rem', color: '#888', marginTop: '4px' }}>
        Upload your waiver to Google Drive and paste the sharing link here. Make sure the link is set to "Anyone with the link can view".
      </small>
    </div>

    {isMinor && (
      <p className="minor-notice">
        ⚠️ As you are under 18, please ensure your guardian has signed the waiver.
      </p>
    )}

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
      <h3>Do you have any dietary restrictions?*</h3>
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
      <h3>Resume Google Drive Link</h3>
      <input
        className="input-field"
        type="url"
        placeholder="https://drive.google.com/file/d/..."
        value={formData.resumeLink || ""}
        onChange={(e) => handleInputChange("resumeLink", e.target.value)}
      />
      <small style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
        Upload your resume to Google Drive and paste the sharing link here. Make sure the link is set to "Anyone with the link can view".
      </small>
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