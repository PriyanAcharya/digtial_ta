import { useState } from "react";

export default function Scratchpad(){
  const [code, setCode] = useState('print("hello from runner")');
  const [output, setOutput] = useState("");

  const run = async () => {
    // TODO: call your code-runner endpoint; placeholder:
    setOutput("▶ Running...\nhello from runner\n(exit 0)");
  };

  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Code Runner</h3>
      <textarea className="textarea" rows="12" value={code} onChange={e=>setCode(e.target.value)} />
      <div style={{display:"flex", gap:8, marginTop:8}}>
        <button className="btn primary" onClick={run}>Run</button>
        <button className="btn" onClick={()=>setCode("")}>Clear</button>
      </div>
      <pre style={{marginTop:12, background:"#0b1430", padding:12, borderRadius:12, border:"1px solid var(--border)", overflow:"auto"}}>{output}</pre>
    </div>
  );
}
