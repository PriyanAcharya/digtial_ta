"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./student.module.css";

export default function StudentPage() {
  const [code, setCode] = useState<string>('print("Hello World")');
  const [output, setOutput] = useState<string>("Awaiting run...");

  function handleRun() {
    // Mocked run result — replace with your API call later
    setOutput(
`Running tests...
✓ Example test passed
✓ Style checks passed
—
Score: 100/100`
    );
  }

  function handleSubmit() {
    alert("Submitted! (wire this to your /api/submit endpoint)");
  }

  return (
    <div className={styles.wrap}>
      {/* Top Bar */}
      <header className={styles.topbar}>
        <div className={styles.brand}>Digital TA</div>
        <nav className={styles.toplinks}>
          <Link href="/">Home</Link>
          <Link href="/leaderboard">Leaderboard</Link>
          <Link href="/login">Logout</Link>
        </nav>
      </header>

      {/* Page Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Student Portal</h1>
          <p className={styles.subtitle}>
            Submit assignments, run code against tests, and track your progress.
          </p>
        </div>
        <div className={styles.badges}>
          <span className={styles.pill}>Python • C++ • Java</span>
          <span className={styles.pillAlt}>Auto-grading enabled</span>
        </div>
      </div>

      {/* Main Grid */}
      <main className={styles.grid}>
        {/* Editor Card */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Code Editor</h3>
            <div className={styles.actions}>
              <button
                className={`${styles.btn} ${styles.outline}`}
                onClick={() => setCode("")}
              >
                Clear
              </button>
              <button className={styles.btn} onClick={handleRun}>
                Run
              </button>
              <button
                className={`${styles.btn} ${styles.primary}`}
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>

          <textarea
            className={styles.editor}
            placeholder="Write Python code here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />

          <div className={styles.hint}>
            Tip: Press <kbd>Run</kbd> to execute tests. Your score appears on the right.
          </div>
        </section>

        {/* Results / Status */}
        <aside className={styles.side}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Results</h3>
            <pre className={styles.output}>{output}</pre>
          </div>

          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Assignment Info</h3>
            <ul className={styles.list}>
              <li><span>Assignment:</span> Sorting Algorithms</li>
              <li><span>Deadline:</span> 15 Nov 2025, 23:59</li>
              <li><span>Language:</span> Python 3.11</li>
              <li><span>Max runtime:</span> 3s per test</li>
            </ul>
          </div>
        </aside>

        {/* Recent Submissions */}
        <section className={styles.fullrow}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardTitle}>Recent Submissions</h3>
              <div className={styles.filters}>
                <select className={styles.select} defaultValue="all">
                  <option value="all">All</option>
                  <option value="passed">Passed</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Score</th>
                    <th>Tests</th>
                    <th>Runtime</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Just now</td>
                    <td>100</td>
                    <td>12/12</td>
                    <td>1.2s</td>
                    <td><span className={styles.badgeOk}>Passed</span></td>
                  </tr>
                  <tr>
                    <td>1h ago</td>
                    <td>83</td>
                    <td>10/12</td>
                    <td>1.6s</td>
                    <td><span className={styles.badgeWarn}>Partial</span></td>
                  </tr>
                  <tr>
                    <td>Yesterday</td>
                    <td>0</td>
                    <td>0/12</td>
                    <td>—</td>
                    <td><span className={styles.badgeErr}>Error</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
