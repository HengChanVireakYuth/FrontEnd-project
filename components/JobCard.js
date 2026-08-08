import Link from "next/link";
import styles from "../styles/JobCard.module.css";

export default function JobCard({ job }) {
  return (
    <Link href={`/jobs/${job._id}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.avatar}>{job.company.charAt(0)}</div>
        <span className={styles.type}>{job.type}</span>
      </div>
      <h3 className={styles.title}>{job.title}</h3>
      <p className={styles.company}>{job.company}</p>
      <div className={styles.meta}>
        <span>{job.location}</span>
        {job.salary && <span>{job.salary}</span>}
      </div>
      <span className={styles.category}>{job.category}</span>
    </Link>
  );
}
