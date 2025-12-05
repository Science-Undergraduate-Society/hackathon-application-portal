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

  // const placeholderTerms =
  //   "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris consectetur placerat imperdiet. Phasellus imperdiet auctor metus, sit amet sodales libero sodales ultricies. Praesent placerat arcu sit amet nibh laoreet iaculis. Nunc a velit nec purus ullamcorper pharetra. Sed quis nulla eu dolor suscipit eleifend vel eu lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aenean id sodales metus. Phasellus maximus hendrerit tristique. Duis scelerisque rhoncus gravida. Morbi rutrum ornare nisl, eu dignissim nunc imperdiet vitae. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Proin a nisl at libero eleifend dignissim. Sed laoreet risus at risus porttitor, nec ultricies risus pretium. Duis lacinia congue fringilla.";

  // const longTerms = placeholderTerms.repeat(5);

  const ubcGuidelines = (
    <>
      <h2>About the Code of Conduct</h2>

      <br/>

      <p>The Student Code of Conduct sets out the standards of conduct expected of students. It holds individuals and groups responsible for the consequences of their actions. Failure to fulfill these responsibilities may result in the withdrawal of privileges or the imposition of sanctions.</p>
      <p>UBC is a community of students, faculty and staff involved in learning, teaching, research and other activities. In accordance with the UBC Respectful Environment Statement, all members of this community are expected to conduct themselves in a manner that contributes positively to an environment in which respect, civility, diversity, opportunity and inclusiveness are valued, so as to assure the success of both the individual and the community. The Student Code of Conduct reflects a concern for these values and tries to ensure that members of UBC and the public can make use of and enjoy the activities, facilities and benefits of UBC without undue interference from others.</p>
      <p>The information provided on this page is an overview of the Student Code of Conduct. It is not, nor is it intended to be, a substitute for the Code itself or UBC&apos;s full policies and regulations regarding non-academic student misconduct. Students are responsible for reading, understanding and abiding by the Code. The entire Student Code of Conduct is available in the Policies and Regulations section of the UBC Vancouver Academic Calendar under Student Conduct and Discipline.</p>
      
      <br/>

      <h2>When does the code apply?</h2>

      <br/>

      <p>The Student Code of Conduct applies to any student enrolled in a credit course at UBC, including co-op and exchange students.</p>
      <p>The Code applies to conduct that occurs on or near the premises of the UBC. It also applies to conduct that occurs elsewhere if it is related to University-sponsored programs or activities, (such as travelling athletic teams), or if it occurs in the context of a relationship between the student and a third party that involves the student&apos;s standing, status or academic record at UBC.</p>
      <p>The Code does not apply to conduct that is assigned to another disciplinary body at the University, allegations regarding a student&apos;s failure to meet standards of professional conduct, or conduct committed by a student solely in their capacity as an employee of UBC.</p>
      <p>Students living in residence may also be subject to a separate residence policy for conduct that occurs in any buildings managed by Student Housing and Community Services or the property surrounding these residences. For further information, please review the applicable Residence Contract/Residential Agreement.</p>
      
      <br/>

      <h4>Sexual Misconduct Policy</h4>

      <br/>

      <p>Sexual misconduct is a form of non-academic misconduct that is prohibited conduct and can give rise to discipline. However, the applicable UBC policy that specifically governs sexual misconduct is UBC&apos;s Sexual Misconduct Policy (SC17).</p>
      <p>The Sexual Misconduct Policy sets out the definition of sexual misconduct, applicable principles, and process as to how the University responds to and investigates allegations of sexual misconduct. As such, it is the Sexual Misconduct Policy that applies to allegations of sexual misconduct rather than the Student Code of Conduct. This means that allegations of conduct that is sexual misconduct as defined in the Sexual Misconduct Policy will be addressed under the Sexual Misconduct Policy and its investigatory process, rather than the process set under the Student Code of Conduct.</p>
      <p>If a student is alleged to have engaged in multiple instances of misconduct that would engage both the Sexual Misconduct Policy and Student Code of Conduct, the responsible offices will work together to determine the appropriate next steps.</p>
      <p>Additional information can be obtained from the Sexual Violence Prevention and Response Office (SVPRO), which provides confidential services for UBC community members who have experienced, or been impacted by, any form of sexual or gender-based violence, harassment, or harm, regardless of where or when it took place.</p>
      
      <p>Allegations of sexual misconduct can be reported to the UBC Investigations Office (IO), with specific information as to the reporting process found on the IO&apos;s website.</p>
      
      <br/>

      <h4>UBC Residence Standards</h4>

      <br/>

      <p>Students living in residence may also be subject to a separate residence policy for conduct that occurs in any buildings managed by Student Housing and Community Services or the property surrounding these residences. For further information, please review the applicable Residence Contract/Residential Agreement.</p>
      
      <h2>Prohibited conduct</h2>

      <br/>

      <p>All municipal, provincial, and federal laws apply on campus.</p>
      <p>Prohibited conduct under the Code includes but is not limited to:</p>
      <ul>
        <li>Assaulting, harassing, intimidating, or threatening another individual or group</li>
        <li>Endangering the health or safety of others</li>
        <li>Stealing, misusing, destroying, defacing or damaging UBC property or property belonging to someone else</li>
        <li>Disrupting University activities</li>
        <li>Using UBC facilities, equipment, services or computers without authorization</li>
        <li>Making false accusations against any member of UBC</li>
        <li>Supplying false information to UBC or forging, altering or misusing any UBC document or record</li>
        <li>Storing, possessing or using real or replica firearms or other weapons, explosives (including fireworks), ammunition, or toxic or otherwise dangerous materials on University grounds</li>
        <li>Using, possessing or distributing illegal drugs</li>
        <li>Violating provincial liquor laws or UBC alcohol policies</li>
        <li>Hazing</li>
        <li>Encouraging, aiding, or conspiring in any prohibited conduct</li>
        <li>Failing to comply with a disciplinary measure or disciplinary measures imposed under the procedures of this Code</li>
      </ul>

      <br/>
      
      <h2>Disciplinary measures</h2>

      <br/>

      <p>Disciplinary measures that may be imposed under the Code include but are not limited to:</p>
      <ul>
        <li>Written warning or reprimand</li>
        <li>Probation, during which certain conditions must be fulfilled and good behaviour must be demonstrated</li>
        <li>Payment of costs or compensation for any loss, damage or injury caused by the conduct</li>
        <li>Issuance of an apology, made publicly or privately</li>
        <li>Loss of certain privileges</li>
        <li>Restriction or prohibition of access to, or use of, UBC facilities, services, activities, or programs</li>
        <li>Fines or loss of fees</li>
        <li>Relocation or exclusion from residence</li>
        <li>Suspension</li>
        <li>Expulsion</li>
      </ul>
    </>
  );

  const ubcGuidelinesLink = "https://students.ubc.ca/campus-life/student-code-conduct"

  if (loading) return <div>Loading...</div>;

  const nextPage = async () => {
    if (!form.emailUpdate || !form.codeOfConductUBC || !form.codeOfConductMLH || !form.infoShareMLH) {
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

        {/* <TermsCard label="1. Resume Sharing" terms={placeholderTerms} />
        <TermsCard label="2. MLH Guidelines" terms={longTerms} /> */}
        <TermsCard label="UBC Code of Conduct" terms={ubcGuidelines} link={ubcGuidelinesLink} />

        <div className="checkbox-container">
          <CheckBox
            label="I agree to receiving email updates from the UBC Science Undergraduate Society."
            checked={form.emailUpdate}
            required
            onChangeFn={(value) =>
              handleChange("emailUpdate")({ target: { value } })
            }
          />
          <CheckBox
            label="I agree to UBC code of conduct guidelines."
            checked={form.codeOfConductUBC}
            required
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
          <div className="mlh-info">
            We are currently in the process of partnering with MLH. The following
          3 checkboxes are for this partnership. If we do not end up partnering
          with MLH, your information will not be shared.
          </div>

          <CheckBox
            label={
              <span>
                I have read and agree to the {" "}
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/code-of-conduct.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Code of Conduct
                </a>
                .
              </span>
            }
            checked={form.codeOfConductMLH}
            required
            onChangeFn={(value) =>
              handleChange("codeOfConductMLH")({ target: { value } })
            }
          />
          <CheckBox
            label={
              <span>
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
                . I further agree to the terms of both the
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/contest-terms.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}MLH Contest Terms and Conditions
                </a>
                {" "}and the{" "}
                <a
                  href="https://github.com/MLH/mlh-policies/blob/main/privacy-policy.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MLH Privacy Policy
                </a>
                .
              </span>
            }
            checked={form.infoShareMLH}
            required
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
