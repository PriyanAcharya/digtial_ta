import { NavLink, Outlet, Link } from "react-router-dom";

export default function InstructorLayout() {
  const link = ({ isActive }) => "tab" + (isActive ? " active" : "");
  return (
    <div className="container">
      <div className="card">
        <div className="nav" style={{justifyContent:"space-between"}}>
          <div className="nav">
            <Link to="/" className="btn ghost">⌂ Home</Link>
            <div className="badge">Instructor Dashboard</div>
          </div>
          <Link to="/choose-role" className="btn">Switch role</Link>
        </div>
        <div className="nav">
          <NavLink to="submissions" className={link}>Submissions</NavLink>
          <NavLink to="gradebook" className={link}>Gradebook</NavLink>
          <NavLink to="plagiarism" className={link}>Plagiarism Checker</NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
