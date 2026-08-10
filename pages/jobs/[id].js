import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import dbConnect from "../../lib/mongodb";
import Job from "../../models/Job";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/JobDetail.module.css";

export default function JobDetail({ job }) {
  const { data: session } = useSession();

  const [message, setMessage] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  if (!job) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "60px 0" }}>
          <p>Job not found.</p>
          <Link href="/jobs">← Back to jobs</Link>
        </div>
        <Footer />
      </>
    );
  }

  async function handleApply(e) {
    e.preventDefault();
    setError("");
    setApplying(true);

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job._id, message, resumeUrl }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
        setApplying(false);
        return;
      }

      setApplied(true);
      setApplying(false);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setApplying(false);
    }
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <Link href="/jobs" className={styles.back}>
          ← Back to jobs
        </Link>

        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.avatar}>{job.company.charAt(0)}</div>
            <div>
              <h1 className={styles.title}>{job.title}</h1>
              <p className={styles.company}>{job.company}</p>
            </div>
          </div>

          <div className={styles.metaRow}>
            <span className={styles.badge}>{job.type}</span>
            <span>{job.location}</span>
            {job.salary && <span>{job.salary}</span>}
            <span>{job.category}</span>
          </div>

          <h2 className={styles.subheading}>Job description</h2>
          <p className={styles.description}>{job.description}</p>

          {!session ? (
            <p className={styles.loginPrompt}>
              <Link href="/login">Log in</Link> to apply for this job.
            </p>
          ) : applied ? (
            <p className={styles.successMsg}>
              ✓ Your application has been submitted. The employer will be in
              touch if it's a match.
            </p>
          ) : (
            <form className={styles.applyForm} onSubmit={handleApply}>
              <h2 className={styles.subheading}>Apply for this job</h2>

              {error && <p className={styles.error}>{error}</p>}

              <label className={styles.label}>
                Message to employer
                <textarea
                  required
                  rows={4}
                  placeholder="Tell them why you're a good fit..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </label>

              <label className={styles.label}>
                Resume link (optional)
                <input
                  type="url"
                  placeholder="https://your-resume-link.com"
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                />
              </label>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={applying}
              >
                {applying ? "Submitting..." : "Submit application"}
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

export async function getServerSideProps({ params }) {
  await dbConnect();

  try {
    const jobDoc = await Job.findById(params.id);
    if (!jobDoc) {
      return { props: { job: null } };
    }
    return { props: { job: JSON.parse(JSON.stringify(jobDoc)) } };
  } catch (err) {
    return { props: { job: null } };
  }
}
