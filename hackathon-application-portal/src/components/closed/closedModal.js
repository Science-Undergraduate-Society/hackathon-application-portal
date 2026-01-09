import Link from "next/link";
import "./closed.css";

export const metadata = {
    title: "Applications Closed | Hackathon Portal",
};

export default function ApplicationClosedModal() {
    return (
        <section className="closed-card">
            <p className="eyebrow">Applications Closed</p>
            <h1>Thanks for your interest!</h1>
            <p className="body-copy">
                Applications for this hackathon are now closed. We are currently reviewing
                submissions and will reach out to selected applicants via email.
            </p>
            <p className="body-copy secondary">
                Follow our <a className="ig-link" href="https://linktr.ee/susubc?utm_source=ig&utm_medium=social&utm_content=link_in_bio">channels</a> for announcements about future events and ways to stay involved
                with the Science Undergraduate Society community.
            </p>
            <div className="button-row">
                <a
                    className="primary-link"
                    href="https://hackathon.susubc.ca"
                    target="_blank"
                    rel="noreferrer"
                >
                    Event Details
                </a>
                <a
                    className="secondary-link"
                    href="https://www.susubc.ca"
                    target="_blank"
                    rel="noreferrer"
                >
                    SUS Home
                </a>
            </div>
        </section>
    );
}
