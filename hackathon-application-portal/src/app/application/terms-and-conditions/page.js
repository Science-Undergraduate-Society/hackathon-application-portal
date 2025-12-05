"use client";

import { useState } from "react";
import { CheckBox, ConfirmBtn } from "@/components/CommonUI";
import { TermsCard } from "@/components/TermsCard";
import useProfileForm from "@/hooks/useProfileForm";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import "./terms-and-conditions.css";
import useAutoClearError from "@/hooks/useAutoClearError";
import WarningDialog from "@/components/warningDialog";
import useIsMobile from "@/hooks/useIsMobile";

export default function TermsAndConditionsPage() {
  const [error, setError] = useAutoClearError();
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const isMobile = useIsMobile();

  const initialState = {
    emailUpdate: false,
    codeOfConductUBC: false,
    photos: false,
    codeOfConductMLH: false,
    infoShareMLH: false,
    emailMLH: false,
  };

  const { form, handleChange, loading, handleBack } = useProfileForm(
    initialState,
    "/application/review",
    "/application/hacker-extra",
  );

  const placeholderTerms =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur placerat imperdiet. Phasellus imperdiet auctor metus, sit amet sodales libero sodales ultricies. Praesent placerat arcu sit amet nibh laoreet iaculis. Nunc a velit nec purus ullamcorper pharetra. Sed quis nulla eu dolor suscipit eleifend vel eu lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean id sodales metus. Phasellus maximus hendrerit tristique. Duis scelerisque rhoncus gravida. Morbi rutrum ornare nisl, eu dignissim nunc imperdiet vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin a nisl at libero eleifend dignissim. Sed laoreet risus at risus porttitor, nec ultricies risus pretium. Duis lacinia congue fringilla.";

  const longTerms = placeholderTerms.repeat(5);

  if (loading) return <div>Loading...</div>;

  const nextPage = async () => {
    if (!form.emailUpdate || !form.codeOfConductUBC) {
      setError("Please check required boxes to proceed.");
      return;
    }

    setSubmitting(true);
    try {
      const usr = auth.currentUser;
      if (!usr) throw new Error("Not authenticated");
      router.push("/application/review");
    } catch (error) {
      console.error("Error saving consents", error);
      setError("Failed to save. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {error && <WarningDialog warningMsg={error} duration={4000} />}

      <div className="container">
        <div className="title-container">
          <h1>Terms And Conditions</h1>
        </div>

        <TermsCard label="1. Resume Sharing" terms={placeholderTerms} />
        <TermsCard label="2. MLH Guidelines" terms={longTerms} />
        <TermsCard label="3. UBC Guidelines" terms={placeholderTerms} />

        <div className="checkbox-container">
          <CheckBox
            label="I agree to receiving email updates from the UBC Science Undergraduate Society.*"
            checked={form.emailUpdate}
            onChangeFn={(value) =>
              handleChange("emailUpdate")({ target: { value } })
            }
          />
          <CheckBox
            label="I agree to UBC code of conduct guidelines.*"
            checked={form.codeOfConductUBC}
            onChangeFn={(value) =>
              handleChange("codeOfConductUBC")({ target: { value } })
            }
          />
          <CheckBox
            label="I agree to have photos taken and posted on our Instagram/website."
            checked={form.photos}
            onChangeFn={(value) =>
              handleChange("photos")({ target: { value } })
            }
          />
          We are currently in the process of partnering with MLH. The following
          3 checkboxes are for this partnership. If we do not end up partnering
          with MLH, your information will not be shared.
          <CheckBox
            label={
              <>
                I have read and agree to the{" "}
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Code of Conduct.
                </a>
              </>
            }
            checked={form.codeOfConductMLH}
            onChangeFn={(value) =>
              handleChange("codeOfConductMLH")({ target: { value } })
            }
          />
          <CheckBox
            label={
              <>
                I authorize you to share my application/registration information
                with Major League Hacking for event administration, ranking, and
                MLH administration in-line with the{" "}
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Privacy Policy
                </a>
                . I further agree to the terms of both the r"
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Contest Terms and Conditions
                </a>{" "}
                and the{" "}
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Privacy Policy.
                </a>
              </>
            }
            checked={form.infoShareMLH}
            onChangeFn={(value) =>
              handleChange("infoShareMLH")({ target: { value } })
            }
          />
          <CheckBox
            label="I authorize MLH to send me occasional emails about relevant events, career opportunities, and community announcements."
            checked={form.emailMLH}
            onChangeFn={(value) =>
              handleChange("emailMLH")({ target: { value } })
            }
          />
        </div>

        <div className="buttons">
          <ConfirmBtn
            onClickFn={nextPage}
            dimension={isMobile ? "sm" : "lg"}
            disabled={submitting}
          />
        </div>
      </div>
    </main>
  );
}
