export default function Gradebook(){
  const rows = [
    { student:"Ananya", OS_A1:92, OS_A2:88, total:180 },
    { student:"Ravi", OS_A1:86, OS_A2:90, total:176 },
  ];
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Gradebook</h3>
      <table className="table">
        <thead><tr><th>Student</th><th>OS A1</th><th>OS A2</th><th>Total</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}><td>{r.student}</td><td>{r.OS_A1}</td><td>{r.OS_A2}</td><td><b>{r.total}</b></td></tr>
          ))}
        </tbody>
      </table>
      <div style={{marginTop:12}}>
        <button className="btn primary">Publish Grades</button>
      </div>
    </div>
  );
}
