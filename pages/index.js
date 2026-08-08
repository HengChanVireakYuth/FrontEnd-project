import { useState } from "react";
import { useRouter } from "next/router";
import dbConnect from "../lib/mongodb";
import Job from "../models/Job";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import JobCard from "../components/JobCard";
import styles from "../styles/Home.module.css";

const CATEGORIES = [
  { name: "Engineering", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📣" },
  { name: "Data", icon: "📊" },
  { name: "Support", icon: "💬" },
];

export default function Home({ featuredJobs, jobCount, companyCount }) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("search", keyword);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <>
      <Navbar />

      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>Find your next opportunity</h1>
          <p className={styles.heroSubtitle}>
            Browse hundreds of jobs from companies actively hiring right now.
          </p>

          <form className={styles.searchBar} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Job title or company"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Search Jobs
            </button>
          </form>

          <div className={styles.stats}>
            <div>
              <strong>{jobCount}+</strong>
              <span>Jobs listed</span>
            </div>
            <div>
              <strong>{companyCount}+</strong>
              <span>Companies</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>New listings</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ marginTop: 64 }}>
        <h2 className={styles.sectionTitle}>Browse by category</h2>
        <div className={styles.categoryGrid}>
          {CATEGORIES.map((cat) => (
            <a
              key={cat.name}
              href={`/jobs?category=${encodeURIComponent(cat.name)}`}
              className={styles.categoryCard}
            >
              <span className={styles.categoryIcon}>{cat.icon}</span>
              <span>{cat.name}</span>
            </a>
          ))}
        </div>
      </section>

      <section className="container" style={{ marginTop: 64 }}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Featured jobs</h2>
          <a href="/jobs" className={styles.viewAll}>
            View all jobs →
          </a>
        </div>
        <div className={styles.jobGrid}>
          {featuredJobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      <section className={styles.howItWorks}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How it works</h2>
          <div className={styles.stepsGrid}>
            <div className={styles.step}>
              <div className={styles.stepNum}>1</div>
              <h3>Create an account</h3>
              <p>Sign up in seconds to start applying to jobs.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>2</div>
              <h3>Search & filter</h3>
              <p>Find roles that match your skills and location.</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNum}>3</div>
              <h3>Apply with ease</h3>
              <p>View job details and reach out to employers directly.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export async function getServerSideProps() {
  await dbConnect();

  const jobsRaw = await Job.find({}).sort({ postedDate: -1 }).limit(6);
  const jobCount = await Job.countDocuments({});
  const companies = await Job.distinct("company");

  const featuredJobs = JSON.parse(JSON.stringify(jobsRaw));

  return {
    props: {
      featuredJobs,
      jobCount,
      companyCount: companies.length,
    },
  };
}
