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
import { countries } from "@/data/countries";
import { levelsOfStudy } from "@/data/levelOfStudy";
import { majors } from "@/data/majors";
import { years } from "@/data/years";
import { pronouns } from "@/data/pronouns";
import { schools } from "@/data/schools";
import { customSelectStyles } from "@/styles/selectStyles";
import { howDidYouHear } from "@/data/hearAboutUs";
import { getFirebaseErrorMessage } from "@/util/firebaseErrorHandler";
import { uploadFile } from "@/services/fileUploadService"; // Add this import

const initialFormState = {
  firstName: "",
  lastName: "",
  email: "",
  age: null,
  pronoun: null,
  country: null,
  phoneNumber: "",
  school: null,
  levelOfStudy: null,
  major: null,
  year: null,
  hackathons: "",
  dietaryRestrictions: "",
  hearAbout: null,
  resumeLink: "",
};

export function SignUpForm({ onSuccess, initialPage = 0 }) {
  const router = useRouter();
  const [error, setError] = useAutoClearError();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showVerifyPassword, setShowVerifyPassword] = useState(false);
  const [isMinor, setIsMinor] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingResume, setUploadingResume] = useState(false);

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
      const result = await signInWithPopup(auth, provider);
      handleInputChange("email", result.user.email);
      setSignUpPage(1);
    } catch (err) {
      setError(getFirebaseErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------------- File Upload Handler ----------------

  const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit");
      return;
    }
    
    const allowedTypes = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or Word document");
      return;
    }
    
    try {
      setUploadingResume(true);
      const auth = getAuth();
      const userId = auth.currentUser?.uid;
        
      if (!userId) {
        setError("User not authenticated");
        setUploadingResume(false);
        return;
      }

      const resumeUrl = await uploadFile(file, userId, 'resume'); 
      console.log(resumeUrl);
      handleInputChange("resumeLink", resumeUrl);
      setResumeFile(file); // Now set the state for display purposes
      setUploadingResume(false);
    } catch (err) {
      setError("Failed to upload resume. Please try again.");
      console.error("Resume upload error:", err);
      setUploadingResume(false);
    }
  }
};

  const handleNextPage = async () => {
    if (signUpPage === 0) {
      if (email && password && verifyPassword) {
        if (password !== verifyPassword) {
          setError("Passwords do not match");
          return;
        }
        try {
          setLoading(true);
          const auth = getAuth();
          await createUserWithEmailAndPassword(auth, email, password);
          handleInputChange("email", email);
          setSignUpPage(1);
        } catch (err) {
          setError(getFirebaseErrorMessage(err));
        } finally {
          setLoading(false);
        }
      } else {
        setError("Please enter email and password");
      }
    } else if (signUpPage === 1) {
      // Check if all fields have values (including custom created options)
      if (formData.firstName && formData.lastName && formData.age && formData.pronoun && formData.country && formData.phoneNumber) {
        setSignUpPage(2);
      } else {
        setError("Please fill in all required fields");
      }
    } else if (signUpPage === 2) {
      if (formData.school && formData.levelOfStudy && formData.year && formData.major) {
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
    if (selectedOption?.value === "lt-18") {
      setIsMinor(true);
    } else {
      setIsMinor(false);
    }
    handleInputChange("age", selectedOption);
  };

  const handlePreviousPage = () => {
    if (signUpPage > 0) setSignUpPage((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.hackathons || !formData.dietaryRestrictions) {
      setError("Please fill in all required fields");
      return;
    }

    if (uploadingResume) {
      setError("Please wait for resume upload to complete");
      return;
    }

    try {
      setLoading(true);

      await saveForm();
      router.push("/application/general-questions");
    } catch (err) {
      setError("Failed to save form. Please try again.");
      console.error("Form submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {error && <WarningDialog warningMsg={error} duration={4000} />}

      {/* ---------------- Page 0: Signup Method ---------------- */}
      {signUpPage === 0 && (
        <div className="formfields-container">
          <h2>Create Account</h2>

          <button className="log-buttons" onClick={handleGoogleSignup} disabled={loading}>
            <img src="/google.png" alt="Google" />
            Create account with Google
          </button>

          <div className="divider"></div>

          <div className="form-field">
            <h3 className="required">Email</h3>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-field">
            <h3 className="required">Password</h3>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                className="input-field"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="form-field">
            <h3 className="required">Verify Password</h3>
            <div className="password-input-wrapper">
              <input
                type={showVerifyPassword ? "text" : "password"}
                className="input-field"
                value={verifyPassword}
                onChange={(e) => setVerifyPassword(e.target.value)}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowVerifyPassword(!showVerifyPassword)}
                aria-label="Toggle verify password visibility"
              >
                {showVerifyPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 1: Name, Age, Pronouns, Country, Phone ---------------- */}
      {signUpPage === 1 && (
        <div className="formfields-container">
          <h2>Personal Info</h2>

          {/* First Name and Last Name side by side */}
          <div className="field-group">
            <div className="form-field-half">
              <h3 className="required">First Name</h3>
              <input
                className="input-field"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
              />
            </div>

            <div className="form-field-half">
              <h3 className="required">Last Name</h3>
              <input
                className="input-field"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
              />
            </div>
          </div>

          {/* Age and Pronouns side by side */}
          <div className="field-group">
            <div className="form-field-half">
              <h3 className="required">Age (as of February 2026)</h3>
              <Select
                options={ages}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
                value={formData.age}
                onChange={handleAgeChange}
              />
            </div>

            <div className="form-field-half">
              <h3 className="required">Pronouns</h3>
              <Creatable
                options={pronouns}
                styles={customSelectStyles}
                formatCreateLabel={(inputValue) => `Other: ${inputValue}`}
                menuPortalTarget={document.body}
                value={formData.pronoun}
                onChange={(selectedOption) =>
                  handleInputChange("pronoun", selectedOption)
                }
                isClearable
              />
            </div>
          </div>

          <div className="form-field">
            <h3 className="required">Country of Residence</h3>
            <Select
              options={countries}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              value={formData.country}
              onChange={(selectedOption) =>
                handleInputChange("country", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3 className="required">Phone Number</h3>
            <input
              className="input-field"
              value={formData.phoneNumber}
              placeholder="000-000-0000"
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
            />
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 2: School, Level, Major, Year ---------------- */}
      {signUpPage === 2 && (
        <div className="formfields-container">
          <h2>Profile Details</h2>

          <div className="form-field">
            <h3 className="required">School</h3>
            <Select
              options={schools}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              value={formData.school}
              onChange={(selectedOption) =>
                handleInputChange("school", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3 className="required">Level Of Study</h3>
            <Select
              options={levelsOfStudy}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              value={formData.levelOfStudy}
              onChange={(selectedOption) =>
                handleInputChange("levelOfStudy", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3 className="required">Major</h3>
            <Select
              options={majors}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              value={formData.major}
              onChange={(selectedOption) =>
                handleInputChange("major", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3 className="required">Year Level</h3>
            <Select
              options={years}
              styles={customSelectStyles}
              menuPortalTarget={document.body}
              value={formData.year}
              onChange={(selectedOption) =>
                handleInputChange("year", selectedOption)
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
            <h3 className="required">How many hackathons have you attended in the past?</h3>
            <input
              className="input-field"
              type="number"
              min="0"
              value={formData.hackathons}
              onChange={(e) => handleInputChange("hackathons", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3 className="required">Do you have any dietary restrictions? (If none write N/A)</h3>
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
              menuPortalTarget={document.body}
              value={formData.hearAbout}
              onChange={(selectedOption) =>
                handleInputChange("hearAbout", selectedOption)
              }
            />
          </div>

          <div className="form-field">
            <h3>Upload your resume </h3>
            
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
              disabled={uploadingResume}
            />
            
            {/* Upload button triggers file input */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <UploadBtn 
                onClickFn={() => document.getElementById('resume-upload').click()}
                dimension="md"
              />
              {resumeFile && (
                <span className="uploaded-file">
                   {resumeFile.name}
                </span>
              )}
              {uploadingResume && (
                <span style={{ fontSize: '0.9rem', color: '#2196F3' }}>
                  Uploading...
                </span>
              )}
            </div>
            
            <small style={{ fontSize: '0.85rem', color: '#888', display: 'block', marginBottom: '15px' }}>
              File size limit of 5 MB. Accepted formats: PDF, DOC, DOCX
            </small>
          </div>

          <div className="button-group">
            <ForwardBtn 
              onClickFn={handleSubmit} 
              dimension="sm"
            />
            <BackwardBtn 
              onClickFn={handlePreviousPage} 
              dimension="sm"
            />
          </div>
          
          {(loading || uploadingResume) && (
            <p style={{ textAlign: 'center', color: '#2196F3', marginTop: '10px' }}>
              {uploadingResume ? 'Uploading resume...' : 'Processing...'}
            </p>
          )}
        </div>
      )}
    </div>
  );
}