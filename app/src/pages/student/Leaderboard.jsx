export default function Leaderboard(){
  const data = [
    { name: "Ananya", pts: 480 },
    { name: "Ravi", pts: 465 },
    { name: "Meera", pts: 452 },
  ];
  return (
    <div className="card" style={{marginTop:12}}>
      <h3>Leaderboard</h3>
      <table className="table">
        <thead><tr><th>Rank</th><th>Student</th><th>Points</th></tr></thead>
        <tbody>
          {data.map((r, i)=>(
            <tr key={i}><td>#{i+1}</td><td>{r.name}</td><td><b>{r.pts}</b></td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
