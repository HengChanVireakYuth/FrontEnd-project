import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import styles from "../../styles/Admin.module.css";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/login");
      return;
    }

    if (!session.user.isAdmin) {
      router.push("/");
      return;
    }

    fetch("/api/admin/applications")
      .then((res) => res.json())
      .then((data) => {
        setApplications(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, [session, status, router]);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="container" style={{ padding: "60px 0" }}>
          <p>Loading...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!session || !session.user.isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h1 className={styles.title}>Admin dashboard</h1>
        <p className={styles.subtitle}>
          {applications.length} application
          {applications.length !== 1 ? "s" : ""} received
        </p>

        {applications.length === 0 ? (
          <p className={styles.empty}>No applications yet.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Applicant</th>
                  <th>Job</th>
                  <th>Company</th>
                  <th>Message</th>
                  <th>Resume</th>
                  <th>Applied</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className={styles.applicant}>
                        <span className={styles.applicantName}>
                          {app.user?.name || "Unknown"}
                        </span>
                        <span className={styles.applicantEmail}>
                          {app.user?.email}
                        </span>
                      </div>
                    </td>
                    <td>
                      {app.job ? (
                        <Link href={`/jobs/${app.job._id}`}>
                          {app.job.title}
                        </Link>
                      ) : (
                        "Deleted job"
                      )}
                    </td>
                    <td>{app.job?.company || "—"}</td>
                    <td className={styles.messageCell}>{app.message}</td>
                    <td>
                      {app.resumeUrl ? (
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
