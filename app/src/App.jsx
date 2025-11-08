// src/App.jsx (or wherever your routes live)
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* keep your existing routes */}
      <Route path="/student" element={<Student />} />
      <Route path="/instructor" element={<Instructor />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/run" element={<RunCode />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
