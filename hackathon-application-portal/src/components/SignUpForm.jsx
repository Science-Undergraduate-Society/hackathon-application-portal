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
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit");
        return;
      }
      
      // Check file type
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF or Word document");
        return;
      }
      
      setResumeFile(file);
      // Clear the Google Drive link if a file is uploaded
      handleInputChange("resumeLink", "");
    }
  };

  const handleNextPage = async () => {
    if (signUpPage === 0) {
      if (email && password) {
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
      if (formData.firstName && formData.lastName && formData.age && formData.pronoun && formData.phoneNumber) {
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

  const isValidGoogleDriveLink = (url) => {
    return url.includes('drive.google.com') || url.includes('docs.google.com');
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

    try {
      setLoading(true);

      // Upload resume file if one was selected
      if (resumeFile) {
        setUploadingResume(true);
        const auth = getAuth();
        const userId = auth.currentUser?.uid;
        
        if (!userId) {
          setError("User not authenticated");
          return;
        }

        const resumeUrl = await uploadFile(resumeFile, userId, 'resume');
        handleInputChange("resumeLink", resumeUrl);
        
        // Save form with the uploaded resume URL
        await saveForm();
      } else {
        // Save form with Google Drive link or no resume
        await saveForm();
      }

      router.push("/application/general-questions");
    } catch (err) {
      setError("Failed to upload resume. Please try again.");
      console.error("Resume upload error:", err);
    } finally {
      setLoading(false);
      setUploadingResume(false);
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
            Continue with Google
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
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="button-group">
            <ForwardBtn onClickFn={handleNextPage} dimension="sm" />
          </div>
        </div>
      )}

      {/* ---------------- Page 1: Name, Age, Pronouns, Phone ---------------- */}
      {signUpPage === 1 && (
        <div className="formfields-container">
          <h2>Personal Info</h2>

          <div className="form-field">
            <h3 className="required">First Name</h3>
            <input
              className="input-field"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
            />
          </div>

          <div className="form-field">
            <h3 className="required">Last Name</h3>
            <input
              className="input-field"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
            />
          </div>

          {/* Age and Pronouns side by side */}
          <div className="field-group">
            <div className="form-field-half">
              <h3 className="required">Age (as of February 2026)</h3>
              <Select
                options={ages}
                styles={customSelectStyles}
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
                value={formData.pronoun}
                onChange={(selectedOption) =>
                  handleInputChange("pronoun", selectedOption)
                }
                isClearable
              />
            </div>
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