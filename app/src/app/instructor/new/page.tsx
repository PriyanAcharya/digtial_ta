'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import JsonEditor from '@/components/JsonEditor';

const sample = `[
  { "name": "Sum small", "points": 5, "public": true,  "input": "2 3\n", "expected": "5\n" },
  { "name": "Edge zeros", "points": 10, "public": false, "input": "0 0\n", "expected": "0\n" }
]`;

export default function NewAssignment(){
  const r = useRouter();
  const [title, setTitle] = useState('Lab 1');
  const [deadline, setDeadline] = useState<string>('');
  const [tests, setTests] = useState(sample);
  const [secret, setSecret] = useState<string>('');

  async function create(){
    const res = await fetch('/api/assignments', {
      method: 'POST',
      headers: { 'Content-Type':'application/json', 'x-instructor-secret': secret },
      body: JSON.stringify({ title, deadline: deadline || null, testsJson: tests })
    });
    if(!res.ok){ alert('Failed. Check secret.'); return; }
    const a = await res.json();
    r.push(`/a/${a.id}`);
  }

  return (
    <div>
      <h2>Create Assignment</h2>
      <div style={{ display:'grid', gap:12 }}>
        <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
        <input placeholder="Deadline (YYYY-MM-DD HH:mm) optional" value={deadline} onChange={e=>setDeadline(e.target.value)} />
        <input placeholder="Instructor Secret" value={secret} onChange={e=>setSecret(e.target.value)} />
        <label>Tests JSON</label>
        <JsonEditor value={tests} onChange={setTests} />
        <button onClick={create}>Create</button>
      </div>
    </div>
  );
}

