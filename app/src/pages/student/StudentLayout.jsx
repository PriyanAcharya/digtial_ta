import { NavLink, Outlet, Link } from "react-router-dom";

export default function StudentLayout() {
  const link = ({ isActive }) => "tab" + (isActive ? " active" : "");
  return (
    <div className="container">
      <div className="card">
        <div className="nav" style={{justifyContent:"space-between"}}>
          <div className="nav">
            <Link to="/" className="btn ghost">⌂ Home</Link>
            <div className="badge">Student Dashboard</div>
          </div>
          <Link to="/choose-role" className="btn">Switch role</Link>
        </div>
        <div className="nav">
          <NavLink to="scoreboard" className={link}>Scoreboard</NavLink>
          <NavLink to="submit" className={link}>Assignment Submission</NavLink>
          <NavLink to="runner" className={link}>Code Runner</NavLink>
          <NavLink to="leaderboard" className={link}>Leaderboard</NavLink>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
