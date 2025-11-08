// src/pages/Home.jsx
import React from "react";
import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  return (
    <div className="site">
      {/* Top nav */}
      <header className="nav">
        <div className="container nav-inner">
          <div className="brand" onClick={() => nav("/")}>Digital TA</div>
          <nav className="links">
            <a onClick={() => nav("/student")}>
              Student
            </a>
            <a onClick={() => nav("/instructor")}>
              Instructor
            </a>
            <a onClick={() => nav("/leaderboard")}>
              Leaderboard
            </a>
            <a onClick={() => nav("/run")}>Run Code</a>
            <a onClick={() => nav("/login")} className="btn btn-outline">
              Log in
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="hero container">
        <div className="hero-text">
          <div className="pill">Fast • Reliable • Scalable</div>
          <h1>
            A cleaner, faster way to <span className="accent">submit</span> and
            <span className="accent"> grade</span> code.
          </h1>
          <p>
            Digital TA handles class‑size submissions, automated grading, and
            plagiarism checks—so students focus on learning and instructors on
            feedback.
          </p>
          <div className="cta">
            <button className="btn btn-primary" onClick={() => nav("/student")}>Enter as Student</button>
            <button className="btn" onClick={() => nav("/instructor")}>Enter as Instructor</button>
          </div>
          <div className="meta">
            <span className="dot"/> No setup • Works on any device • Live scoreboard
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-inner">
            <div className="hero-stat">
              <span className="stat">150</span>
              <span className="label">simultaneous submissions</span>
            </div>
            <div className="divider"/>
            <div className="hero-stat">
              <span className="stat"><span className="ok">99.9%</span></span>
              <span className="label">uptime target</span>
            </div>
            <div className="divider"/>
            <div className="hero-stat">
              <span className="stat"><span className="ok"><span className="spark"/>Fast</span></span>
              <span className="label">auto‑grading</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
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
          <button className="btn btn-primary" onClick={() => nav("/student")}>Go to Student Dashboard</button>
        </article>
        <article className="card role">
          <div className="card-badge purple">For Instructors</div>
          <h3>Review at scale</h3>
          <p>Collect, grade, and audit submissions—plus built‑in plagiarism checks.</p>
          <ul className="list">
            <li>Auto & manual grading</li>
            <li>Plagiarism reports</li>
            <li>CSV export & analytics</li>
          </ul>
          <button className="btn" onClick={() => nav("/instructor")}>Go to Instructor Dashboard</button>
        </article>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <div>© {new Date().getFullYear()} Digital TA</div>
          <div className="foot-links">
            <a onClick={() => nav("/privacy")}>Privacy</a>
            <a onClick={() => nav("/terms")}>Terms</a>
            <a onClick={() => nav("/contact")}>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
