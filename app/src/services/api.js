import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API || "http://localhost:3000/api",
  withCredentials: true,
});

// Simple helpers — adjust paths to match your backend
export const getStudentScoreboard = (studentId) =>
  API.get(`/students/${studentId}/scores`).then(r => r.data);

export const getLeaderboard = (courseId) =>
  API.get(`/courses/${courseId}/leaderboard`).then(r => r.data);

export const submitAssignment = (payload) =>
  API.post(`/assignments/${payload.assignmentId}/submit`, payload).then(r => r.data);

export const runCode = (payload) =>
  API.post(`/runner/execute`, payload).then(r => r.data);

export const getSubmissions = (assignmentId) =>
  API.get(`/assignments/${assignmentId}/submissions`).then(r => r.data);

export const getGradebook = (courseId) =>
  API.get(`/courses/${courseId}/gradebook`).then(r => r.data);

export const checkPlagiarism = (assignmentId) =>
  API.post(`/plagiarism/check`, { assignmentId }).then(r => r.data);
