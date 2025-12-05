"use client";

import { useState, useEffect } from "react";
import { auth } from "../../../lib/firebase";
import { useRouter } from "next/navigation";
import {
  fetchUserProfile,
  saveUserProfile,
} from "../../../services/userService";
import { appendToSheet } from "../../../lib/sheets";
import useAutoClearError from "@/hooks/useAutoClearError";
import useIsMobile from "@/hooks/useIsMobile";
import WarningDialog from "@/components/warningDialog";
import LoadingSpinner from "@/components/LoadingSpinner";
import "./review.css";

export default function ReviewPage() {
  const [data, setData] = useState(null);
  const [consents, setConsents] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useAutoClearError();
  const router = useRouter();
  const isMobile = useIsMobile();

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      const usr = auth.currentUser;
      if (!usr) {
        router.push("/");
        return;
      }

      const profile = await fetchUserProfile(usr.uid);

      if (profile.hasSubmitted) {
        router.push("/application/thank-you?duplicate=true");
        return;
      }

      setData(profile);
    };

    checkSubmissionStatus();

    // Also listen for auth changes
    let unsub;
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth, async (usr) => {
        if (!usr) return router.push("/");
        const profile = await fetchUserProfile(usr.uid);

        if (profile.hasSubmitted) {
          router.push("/application/thank-you?duplicate=true");
          return;
        }

        setData(profile);

        // Get consents from profile (saved in TC page)
        setConsents(
          profile.consents || {
            emailUpdate: false,
            codeOfConductUBC: false,
            photos: false,
            codeOfConductMLH: false,
            infoShareMLH: false,
            emailMLH: false,
          },
        );
      });
    });

    return () => unsub && unsub();
  }, [router]);

  // Separate useEffect to log data when it changes
  useEffect(() => {
    if (data) {
      console.log("User data:", data);
    }
  }, [data]);

  if (!data || !consents) return <LoadingSpinner />;

  const handleBack = () => {
    router.push("/application/terms-and-conditions");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    console.log("submitting...");
    try {
      const usr = auth.currentUser;

      if (!usr) throw new Error("Not authenticated");

      const freshData = await fetchUserProfile(usr.uid);

      if (freshData.hasSubmitted) {
        router.push("/application/thank-you?duplicate=true");
        return;
      }

      const row = [
        freshData.firstName,
        freshData.lastName,
        freshData.email,
        freshData.phoneNumber,
        freshData.age?.label || freshData.age,
        freshData.pronoun?.label || freshData.pronoun,

        freshData.school?.label || freshData.school,
        freshData.levelOfStudy?.label || freshData.levelOfStudy,
        freshData.major?.label || freshData.major,
        freshData.year?.label || freshData.year,

        freshData.hackathons,
        freshData.dietaryRestrictions,

        freshData.resumeLink,
        freshData.waiverLink,

        freshData.question1,
        freshData.question2,
        freshData.question3,
        freshData.question4,
        freshData.question5,

        consents.emailUpdate ? "Yes" : "No",
        consents.codeOfConductUBC ? "Yes" : "No",
        consents.photos ? "Yes" : "No",
        consents.codeOfConductMLH ? "Yes" : "No",
        consents.infoShareMLH ? "Yes" : "No",
        consents.emailMLH ? "Yes" : "No",
        freshData.hearAbout?.label || freshData.hearAbout,
      ];

      await appendToSheet(row);
      await saveUserProfile(usr.uid, { ...freshData, hasSubmitted: true });

      router.push("/application/thank-you");
    } catch (error) {
      console.error("Error submitting to Google Sheets", error);
      setError("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  function displayValue(val) {
    if (!val) return "None";
    if (typeof val === "object" && val.label) return val.label;

    return String(val);
  }

  return (
    <main>
      {error && <WarningDialog warningMsg={error} duration={4000} />}

      <h1>Review Your Application</h1>

      <div className="review-container">
        <section>
          <div className="review-container-row">
            <div className="review-item-sm">
              <h3>Full Name</h3>
              <p>
                {data.firstName} {data.lastName}
              </p>
            </div>

            <div className="review-item-sm">
              <h3>Pronouns</h3>
              <p>{displayValue(data.pronoun)}</p>
            </div>

            <div className="review-item-sm">
              <h3>Age</h3>
              <p>{displayValue(data.age)}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item-sm">
              <h3>Email</h3>
              <p>{data.email}</p>
            </div>

            <div className="review-item-sm">
              <h3>Phone</h3>
              <p>{data.phoneNumber}</p>
            </div>

            <div className="review-item-sm">
              <h3>Level of Study</h3>
              <p>{displayValue(data.levelOfStudy)}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item-sm">
              <h3>School</h3>
              <p>{displayValue(data.school)}</p>
            </div>

            <div className="review-item-sm">
              <h3>Year</h3>
              <p>{displayValue(data.year)}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item">
              <h3>Major</h3>
              <p>{displayValue(data.major)}</p>
            </div>
          </div>
        </section>

        <span className="divider" />

        <section>
          <div className="review-container-row">
            <div className="review-item">
              <h3>Hackathons Attended</h3>
              <p>{data.hackathons}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item">
              <h3>Dietary Restrictions</h3>
              <p>{data.dietaryRestrictions || "None"}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item">
              <h3>Where did you hear about us?</h3>
              <p>{displayValue(data.hearAbout)}</p>
            </div>
          </div>

          {true && (
            <div className="review-container-row">
              <div className="review-item">
                <a
                  href={data.resumeLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  <h3 className="resume-heading">
                    Resume{" "}
                    <svg
                      className="external-icon"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </h3>
                </a>
              </div>
            </div>
          )}
          <span className="divider" />
        </section>

        <span className="divider" />

        {/* ------- SECTION 3 (QUESTIONS) ------- */}
        <section>
          <div className="review-container-row">
            <div className="review-item full-width">
              <h3>
                What do you hope to learn from attending this hackathon? Why?
              </h3>
              <p>{data.question1}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item full-width">
              <h3>
                What is a recent challenge you faced, and how did you approach
                it?
              </h3>
              <p>{data.question2}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item full-width">
              <h3>Describe the kind of role you play on a team.</h3>
              <p>{data.question3}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item full-width">
              <h3>Your favourite body of water (and why)</h3>
              <p>{data.question4}</p>
            </div>
          </div>

          <div className="review-container-row">
            <div className="review-item full-width">
              <h3>Song Recommendation</h3>
              <p>{data.question5}</p>
            </div>
          </div>
        </section>
      </div>

      <div className="btn-container">
        <button className="back-button" onClick={handleBack}>
          <span className="arrow-icon">←</span>
        </button>
        <button
          className="submit-button"
          onClick={handleSubmit}
          dimension={isMobile ? "sm" : "lg"}
        >
          <span className="button-text">
            {submitting ? "Submitting..." : "Submit Application"}
          </span>
        </button>
      </div>
    </main>
  );
}
