"use client";
import React, { useState } from "react";
import Link from "next/link";
import styles from "./instructor.module.css";

type Assignment = {
  id: string;
  title: string;
  due: string;
  submissions: number;
  status: "Open" | "Closed" | "Draft";
};

export default function InstructorPage() {
  const [title, setTitle] = useState("");
  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: "a1", title: "Sorting Algorithms", due: "15 Nov 2025", submissions: 128, status: "Open" },
    { id: "a2", title: "Dynamic Programming I", due: "20 Nov 2025", submissions: 94, status: "Open" },
    { id: "a3", title: "Complexity Basics (Quiz)", due: "10 Nov 2025", submissions: 200, status: "Closed" },
  ]);

  function createAssignment() {
    const t = title.trim();
    if (!t) return;
    setAssignments(prev => [
      { id: Math.random().toString(36).slice(2), title: t, due: "TBD", submissions: 0, status: "Draft" },
      ...prev,
    ]);
    setTitle("");
  }

  return (
    <div className={styles.wrap}>
      {/* Top Bar */}
      <header className={styles.topbar}>
        <div className={styles.brand}>Digital TA</div>
        <nav className={styles.toplinks}>
          <Link href="/">Home</Link>
          <Link href="/student">Switch to Student</Link>
          <Link href="/login">Logout</Link>
        </nav>
      </header>

      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Instructor Dashboard</h1>
          <p className={styles.subtitle}>Review submissions, grade efficiently, and monitor plagiarism—at scale.</p>
        </div>
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.primary}`} onClick={createAssignment} disabled={!title.trim()}>
            + Create Assignment
          </button>
        </div>
      </div>

      {/* Quick Create */}
      <section className={`${styles.card} ${styles.quickCreate}`}>
        <input
          className={styles.input}
          placeholder="Assignment title (e.g., Graph Traversal)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className={`${styles.btn} ${styles.outline}`} onClick={() => setTitle("")}>Clear</button>
        <button className={`${styles.btn} ${styles.primary}`} onClick={createAssignment} disabled={!title.trim()}>
          Create
        </button>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <article className={styles.stat}>
          <div className={styles.statLabel}>Submissions (today)</div>
          <div className={styles.statValue}>312</div>
          <div className={styles.statBar}><span style={{width:"76%"}}/></div>
        </article>
        <article className={styles.stat}>
          <div className={styles.statLabel}>Average Score</div>
          <div className={styles.statValue}>78%</div>
          <div className={styles.statBar}><span style={{width:"78%"}}/></div>
        </article>
        <article className={styles.stat}>
          <div className={styles.statLabel}>Active Assignments</div>
          <div className={styles.statValue}>6</div>
          <div className={styles.statBar}><span style={{width:"60%"}}/></div>
        </article>
        <article className={styles.stat}>
          <div className={styles.statLabel}>Plagiarism Flags</div>
          <div className={styles.statValue}>9</div>
          <div className={`${styles.statBar} ${styles.warn}`}><span style={{width:"30%"}}/></div>
        </article>
      </section>

      {/* Main Grid */}
      <main className={styles.grid}>
        {/* Assignments Table */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Assignments</h3>
            <div className={styles.filters}>
              <select className={styles.select} defaultValue="all">
                <option value="all">All</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due</th>
                  <th>Submissions</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td>{a.title}</td>
                    <td>{a.due}</td>
                    <td>{a.submissions}</td>
                    <td>
                      {a.status === "Open" && <span className={styles.badgeOk}>Open</span>}
                      {a.status === "Closed" && <span className={styles.badgeErr}>Closed</span>}
                      {a.status === "Draft" && <span className={styles.badgeWarn}>Draft</span>}
                    </td>
                    <td className={styles.rowActions}>
                      <button className={`${styles.btn} ${styles.small}`}>View</button>
                      <button className={`${styles.btn} ${styles.small}`}>Grade</button>
                      <button className={`${styles.btn} ${styles.small} ${styles.outline}`}>Close</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Right column: Queue + Plagiarism */}
        <aside className={styles.side}>
          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Grading Queue</h3>
            <ul className={styles.queue}>
              <li><span>Priya A.</span><em>Sorting Algorithms</em><b>Needs review</b></li>
              <li><span>Rahul K.</span><em>DP I</em><b>Autograde OK</b></li>
              <li><span>Ananya S.</span><em>Graph Traversal</em><b>Failed tests</b></li>
              <li><span>Manas R.</span><em>Complexity Quiz</em><b>Manual check</b></li>
            </ul>
            <div className={styles.queueActions}>
              <button className={`${styles.btn} ${styles.primary}`}>Open next</button>
              <button className={styles.btn}>View all</button>
            </div>
          </section>

          <section className={styles.card}>
            <h3 className={styles.cardTitle}>Plagiarism Checks</h3>
            <div className={styles.plagRow}>
              <div className={styles.plagScore}><span style={{width:"18%"}}/></div>
              <div className={styles.plagMeta}>
                <div className={styles.plagTitle}>a1 — Sorting Algorithms</div>
                <div className={styles.plagText}>18% similarity across 3 pairs</div>
              </div>
              <button className={`${styles.btn} ${styles.small}`}>Review</button>
            </div>
            <div className={styles.plagRow}>
              <div className={`${styles.plagScore} ${styles.warn}`}><span style={{width:"46%"}}/></div>
              <div className={styles.plagMeta}>
                <div className={styles.plagTitle}>a2 — DP I</div>
                <div className={styles.plagText}>46% similarity across 7 pairs</div>
              </div>
              <button className={`${styles.btn} ${styles.small}`}>Review</button>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
