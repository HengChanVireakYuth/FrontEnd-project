import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import JobCard from "../../components/JobCard";
import styles from "../../styles/Jobs.module.css";

const CATEGORIES = ["Engineering", "Design", "Marketing", "Data", "Support"];
const TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Remote"];

export default function Jobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  // Sync filters from URL query params on first load
  useEffect(() => {
    if (!router.isReady) return;
    const { search, location, category, type } = router.query;
    if (search) setSearch(search);
    if (location) setLocation(location);
    if (category) setCategory(category);
    if (type) setType(type);
  }, [router.isReady]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (location) params.set("location", location);
    if (category) params.set("category", category);
    if (type) params.set("type", type);

    const res = await fetch(`/api/jobs?${params.toString()}`);
    const data = await res.json();
    setJobs(data);
    setLoading(false);
  }, [search, location, category, type]);

  useEffect(() => {
    if (!router.isReady) return;
    fetchJobs();
  }, [router.isReady, fetchJobs]);

  function handleSubmit(e) {
    e.preventDefault();
    fetchJobs();
  }

  function clearFilters() {
    setSearch("");
    setLocation("");
    setCategory("");
    setType("");
  }

  return (
    <>
      <Navbar />

      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <h1 className={styles.title}>Browse jobs</h1>

        <form className={styles.filterBar} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Job title or company"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">All types</option>
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">
            Filter
          </button>
          <button type="button" className="btn btn-outline" onClick={clearFilters}>
            Clear
          </button>
        </form>

        {loading ? (
          <p className={styles.status}>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className={styles.status}>No jobs match your search.</p>
        ) : (
          <>
            <p className={styles.resultCount}>{jobs.length} jobs found</p>
            <div className={styles.jobGrid}>
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </>
  );
}
