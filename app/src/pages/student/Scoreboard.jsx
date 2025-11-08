export default function Scoreboard() {
  const rows = [
    { course: "DSA", assignment: "A1", score: 92 },
    { course: "OS", assignment: "Lab 2", score: 86 },
    { course: "DBMS", assignment: "Project", score: 95 },
  ];
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Your Scores</h3>
      <table className="table">
        <thead><tr><th>Course</th><th>Assignment</th><th>Score</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}><td>{r.course}</td><td>{r.assignment}</td><td><b>{r.score}</b></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
