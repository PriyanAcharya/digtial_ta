export default function Submissions(){
  const rows = [
    { id:"OS-A1", student:"Ravi", status:"Passed", time:"11:42" },
    { id:"OS-A1", student:"Meera", status:"Failed", time:"11:45" },
  ];
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Recent Submissions</h3>
      <table className="table">
        <thead><tr><th>Assignment</th><th>Student</th><th>Status</th><th>Timestamp</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}><td>{r.id}</td><td>{r.student}</td><td>{r.status}</td><td>{r.time}</td></tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:12, display:"flex", gap:8}}>
        <button className="btn">Re-run selected</button>
        <button className="btn">Export CSV</button>
      </div>
    </div>
  );
}
