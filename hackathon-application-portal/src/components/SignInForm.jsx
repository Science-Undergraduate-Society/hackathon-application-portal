'use client';

import React, { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { auth } from "../lib/firebase";
import EmailAndPassword from "./EmailAndPassword";
import { BackwardBtn, ConfirmBtn } from "./CommonUI";
import WarningDialog from "./warningDialog";
import "./SignInForm.css";

export function SignInForm({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithPopup(provider);
      onSuccess();
    } catch (err) {
      setError(err.message); // set the error to show WarningDialog
    } finally {
      setLoading(false);
    }
  };

  const submitEmailLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await auth.signInWithEmailAndPassword(formData.email, formData.password);
      onSuccess();
    } catch (err) {
      setError(err.message); // show error in toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>Log In to Your Hacker Account!</h1>

      {/* Warning dialog appears whenever there is an error */}
      {error && <WarningDialog warningMsg={error} duration={4000} />}

      {/* Google / Email buttons if email form is not shown */}
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

      {/* Show Email + Password Form */}
      {showEmailForm && (
        <div style={{ width: "100%", maxWidth: 509 }}>
          <EmailAndPassword
            formData={formData}
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
