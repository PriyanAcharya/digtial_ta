'use client';
import Editor from 'react-monaco-editor';
import { useState } from 'react';

export default function Client({ id, title, publicCount }: { id:number; title:string; publicCount:number }){
  const [code, setCode] = useState(`# read two ints and print sum\nimport sys\na,b=map(int,sys.stdin.read().split())\nprint(a+b)\n`);
  const [name, setName] = useState('Student One');
  const [out, setOut] = useState<string>('');
  const [result, setResult] = useState<any>(null);

  async function runSample(){
    const res = await fetch('/api/snippet/run', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code, stdin: '2 3\n' }) });
    const j = await res.json();
    setOut(j.stdout || j.stderr || j.compile_output || JSON.stringify(j));
  }

  async function submit(){
    setResult(null);
    const res = await fetch(`/api/assignments/${id}/submit`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ code, studentName: name }) });
    const j = await res.json();
    setResult(j);
  }

  return (
    <div>
      <h2>{title}</h2>
      <p>Public tests visible after submit: {publicCount}</p>
      <div style={{ display:'grid', gap:8, margin:'12px 0' }}>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" />
        <Editor height="360" language="python" value={code} onChange={(v)=>setCode(v)} />
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={runSample}>Run sample</button>
          <button onClick={submit}>Submit</button>
        </div>
        {out && (<pre style={{ background:'#111', color:'#0f0', padding:8 }}>{out}</pre>)}
        {result && (
          <div>
            <h3>Result: {result.score} / {result.maxScore}</h3>
            <ul>
              {result.results.map((r:any, i:number)=> (
                <li key={i}>
                  {r.passed ? '✅' : '❌'} {r.name} — {r.runtime_ms} ms {r.passed ? `(+${r.points})` : ''}
                  {r.stderr && <details><summary>stderr</summary><pre>{r.stderr}</pre></details>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
