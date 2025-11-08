import { useState } from "react";

export default function Plagiarism(){
  const [assignmentId, setAssignmentId] = useState("OS-A1");
  const [result, setResult] = useState(null);

  const runCheck = async () => {
    // TODO: call your backend plagiarism endpoint
    setResult({ pairs: [{a:"Ravi", b:"Meera", score:0.78}], threshold:0.7 });
  };

  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Plagiarism Checker</h3>
      <div style={{display:"grid", gap:10, gridTemplateColumns:"1fr auto"}}>
        <input className="input" value={assignmentId} onChange={e=>setAssignmentId(e.target.value)} />
        <button className="btn primary" onClick={runCheck}>Run Check</button>
      </div>

      {result && (
        <div style={{marginTop:12}}>
          <p className="p">Threshold: {result.threshold}</p>
          <table className="table">
            <thead><tr><th>Student A</th><th>Student B</th><th>Similarity</th></tr></thead>
            <tbody>
              {result.pairs.map((p, i)=>(
                <tr key={i}><td>{p.a}</td><td>{p.b}</td><td><b>{(p.score*100).toFixed(1)}%</b></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
