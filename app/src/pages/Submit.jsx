import { useState, useMemo } from "react";
import { submitCode, runCode } from "../../services/api";

export default function Submit() {
  // You can swap this for your auth context later
  const studentId = useMemo(
    () => localStorage.getItem("studentId") || "S123",
    []
  );

  const [form, setForm] = useState({
    assignmentId: "",
    language: "python",
    code: "",
  });

  const [status, setStatus] = useState("");      // user-visible status/message
  const [running, setRunning] = useState(false); // disables buttons while busy

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.assignmentId || !form.code) {
      setStatus("Please fill assignment and code before submitting.");
      return;
    }
    setRunning(true);
    setStatus("Submitting…");
    try {
      const res = await submitCode(
        form.assignmentId,
        studentId,
        form.code,
        form.language
      );
      // backend can return { jobId, score, verdict, ... } — show whatever is present
      const parts = [];
      if (res.jobId) parts.push(`Job: ${res.jobId}`);
      if (res.verdict) parts.push(`Verdict: ${res.verdict}`);
      if (typeof res.score !== "undefined") parts.push(`Score: ${res.score}`);
      setStatus(parts.length ? `✅ ${parts.join(" • ")}` : "✅ Submitted.");
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Unknown error";
      setStatus(`❌ Submit failed: ${msg}`);
    } finally {
      setRunning(false);
    }
  }

  async function handleRun() {
    if (!form.code) {
      setStatus("Paste some code first, then Run.");
      return;
    }
    setRunning(true);
    setStatus("Running tests…");
    try {
      const res = await runCode({ language: form.language, code: form.code });
      // backend might return { output, errors, time, exitCode }
      let text = "";
      if (res.output) text += res.output;
      if (res.errors) text += (text ? "\n" : "") + res.errors;
      if (!text) text = JSON.stringify(res, null, 2);
      setStatus("▶ Output:\n" + text);
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || "Unknown error";
      setStatus(`❌ Run failed: ${msg}`);
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="card" style={{ marginTop: 12 }}>
      <h3>Submit & Grade</h3>
      <form onSubmit={handleSubmit} className="row" style={{ gridTemplateColumns: "1fr" }}>
        <div>
          <label>Assignment</label>
          <input
            className="input"
            name="assignmentId"
            required
            placeholder="e.g., OS-A1"
            onChange={update}
            value={form.assignmentId}
          />
        </div>
        <div>
          <label>Language</label>
          <select className="select" name="language" value={form.language} onChange={update}>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
            <option value="js">JavaScript</option>
          </select>
        </div>
        <div>
          <label>Code</label>
          <textarea
            className="textarea"
            name="code"
            rows="12"
            spellCheck="false"
            placeholder="# paste your solution…"
            onChange={update}
            value={form.code}
          />
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="submit" className="btn primary" disabled={running}>
            {running ? "Submitting…" : "Submit"}
          </button>
          <button type="button" className="btn" onClick={handleRun} disabled={running}>
            {running ? "Running…" : "Run Tests"}
          </button>
        </div>
      </form>

      {status && (
        <pre
          style={{
            marginTop: 12,
            background: "#0b1430",
            padding: 12,
            borderRadius: 12,
            border: "1px solid var(--border)",
            whiteSpace: "pre-wrap",
          }}
        >
          {status}
        </pre>
      )}
    </div>
  );
}
