import { Link } from "react-router-dom";

export default function RoleSelect() {
  return (
    <div className="container">
      <div className="card" style={{textAlign:"center"}}>
        <h1 className="h1">Choose your role</h1>
        <p className="p">You can switch roles later from the dashboard.</p>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
          <Link to="/student" className="btn primary">I’m a Student</Link>
          <Link to="/instructor" className="btn">I’m an Instructor</Link>
          <Link to="/" className="btn ghost">Back home</Link>
        </div>
      </div>
    </div>
  );
}
