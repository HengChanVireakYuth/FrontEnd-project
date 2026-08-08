import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          Job<span>Board</span>
        </Link>

        <nav className={styles.links}>
          <Link href="/">Home</Link>
          <Link href="/jobs">Browse Jobs</Link>
        </nav>

        <div className={styles.actions}>
          {status === "loading" ? null : session ? (
            <>
              <span className={styles.greeting}>Hi, {session.user.name}</span>
              <button
                className="btn btn-outline"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-outline">
                Log in
              </Link>
              <Link href="/signup" className="btn btn-primary">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
