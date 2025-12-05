'use client';

import React from "react";
import EmailAndPassword from "./EmailAndPassword";
import { BackwardBtn, ConfirmBtn } from "./CommonUI";
import WarningDialog from "./warningDialog";
import useAuth from "@/hooks/useAuth";
import "./SignInForm.css";

const initialFormState = {
  firstName: "",
  lastName: "",
  age: null,
  pronoun: null,
  phoneNumber: "",
  levelOfStudy: null,
  school: null,
  hackathons: "",
  dietaryRestrictions: "",
  hearAbout: null,
  resume: null,
};

export function SignInForm({ onSuccess, onIncompleteProfile }) {
  const [showEmailForm, setShowEmailForm] = React.useState(false);

  const {
    modalOpen,
    signUpPage,
    email,
    setEmail,
    password,
    setPassword,
    emailSignIn,
    googleSignIn,
    loading,
    error
  } = useAuth(initialFormState);

  // When profile is incomplete, notify parent
  React.useEffect(() => {
    if (modalOpen && signUpPage > 0 && onIncompleteProfile) {
      onIncompleteProfile(signUpPage);
    }
  }, [modalOpen, signUpPage, onIncompleteProfile]);

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (err) {
      getFirebaseErrorMessage(err);
    }
  };

  const submitEmailLogin = async () => {
    try {
      await emailSignIn();
    } catch (err) {
      getFirebaseErrorMessage(err);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In to Your Hacker Account!</h1>

      {error && <WarningDialog warningMsg={error} duration={4000} />}

      {!showEmailForm && (
        <>
          <button
            className="log-buttons"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <img src="/google.png" alt="Google" />
            {loading ? "Signing in..." : "Sign In With Google"}
          </button>

          <div className="divider"></div>

          <button
            className="log-buttons"
            onClick={() => setShowEmailForm(true)}
            disabled={loading}
          >
            <img src="/email.png" alt="Email" />
            Sign In With Email
          </button>
        </>
      )}

      {showEmailForm && (
        <div style={{ width: "100%", maxWidth: 509 }}>
          <EmailAndPassword
            formData={{ email, password }}
            handleInputChange={handleInputChange}
          />

          <div className="btn-row">
            <BackwardBtn
              onClickFn={() => setShowEmailForm(false)}
              dimension={"sm"}
            />

            <ConfirmBtn
              onClickFn={submitEmailLogin}
              dimension={"sm"}
            />
          </div>
        </div>
      )}
    </div>
  );
}