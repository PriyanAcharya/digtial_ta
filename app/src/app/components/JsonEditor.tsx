'use client';
import { useState } from 'react';
export default function JsonEditor({ value, onChange }: { value: string; onChange: (v: string)=>void }){
  const [v, setV] = useState(value);
  return (
    <textarea
      value={v}
      onChange={(e)=>{ setV(e.target.value); onChange(e.target.value); }}
      style={{ width: '100%', height: 240, fontFamily: 'ui-monospace, SFMono-Regular', fontSize: 13 }}
    />
  );
}

