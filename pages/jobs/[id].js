import { useSession } from "next-auth/react";
import Link from "next/link";
import dbConnect from "../../lib/mongodb";
import Job from "../../models/Job";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/JobDetail.module.css";

export default function JobDetail({ job }) {
  const { data: session } = useSession();

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

          {session ? (
            <button className="btn btn-primary">Apply now</button>
          ) : (
            <div>
              <p className={styles.loginPrompt}>
                <Link href="/login">Log in</Link> to apply for this job.
              </p>
            </div>
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
