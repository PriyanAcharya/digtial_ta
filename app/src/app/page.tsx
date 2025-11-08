"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <div className="site">
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand" onClick={() => router.push("/")}>
            Digital TA
          </div>
          <nav className="links">
            <Link href="/student">Student</Link>
            <Link href="/instructor">Instructor</Link>
            <Link href="/leaderboard">Leaderboard</Link>
            <Link href="/run">Run Code</Link>
            <Link href="/login" className="btn btn-outline">Log in</Link>
          </nav>
        </div>
      </header>

      <section className="hero container">
        <div className="hero-text">
          <div className="pill">Fast • Reliable • Scalable</div>
          <h1>
            A cleaner, faster way to <span className="accent">submit</span> and
            <span className="accent"> grade</span> code.
          </h1>
          <p>
            Digital TA handles class-size submissions, automated grading, and
            plagiarism checks—so students focus on learning and instructors on
            feedback.
          </p>
          <div className="cta">
            <button className="btn btn-primary" onClick={() => router.push("/student")}>
              Enter as Student
            </button>
            <button className="btn" onClick={() => router.push("/instructor")}>
              Enter as Instructor
            </button>
          </div>
          <div className="meta">
            <span className="dot" /> No setup • Works on any device • Live scoreboard
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-inner">
            <div className="hero-stat">
              <span className="stat">150</span>
              <span className="label">simultaneous submissions</span>
            </div>
            <div className="divider" />
            <div className="hero-stat">
              <span className="stat"><span className="ok">99.9%</span></span>
              <span className="label">uptime target</span>
            </div>
            <div className="divider" />
            <div className="hero-stat">
              <span className="stat"><span className="ok"><span className="spark" />Fast</span></span>
              <span className="label">auto-grading</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container grid">
        <article className="card role">
          <div className="card-badge">For Students</div>
          <h3>Submit in seconds</h3>
          <p>Upload code, run against tests, see results and climb the leaderboard.</p>
          <ul className="list">
            <li>Instant compile & run</li>
            <li>Detailed test feedback</li>
            <li>Score history</li>
          </ul>
          <Link href="/student" className="btn btn-primary">Go to Student Dashboard</Link>
        </article>

        <article className="card role">
          <div className="card-badge purple">For Instructors</div>
          <h3>Review at scale</h3>
          <p>Collect, grade, and audit submissions—plus built-in plagiarism checks.</p>
          <ul className="list">
            <li>Auto & manual grading</li>
            <li>Plagiarism reports</li>
            <li>CSV export & analytics</li>
          </ul>
          <Link href="/instructor" className="btn">Go to Instructor Dashboard</Link>
        </article>
      </section>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} Digital TA</div>
          <div className="foot-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
