import express from "express";
import cors from "cors";
import multer from "multer";
import { Queue } from "bullmq";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs";
import "dotenv/config";

const app = express();

// CORS: allow your Next.js origin (dev) and any Codespaces domain
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const STORAGE_DIR = process.env.STORAGE_DIR || "./storage";

const gradeQueue = new Queue("grade-queue", {
  connection: { host: REDIS_HOST, port: REDIS_PORT },
});

// Multer stores upload to disk first (low RAM pressure)
const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(STORAGE_DIR, "tmp"),
    filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  }),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per zip
});

// Health
app.get("/api/health", (_req, res) => res.json({ ok: true }));

// Folder-zip upload (client zips; we just receive)
app.post("/api/assignments/:id/upload", upload.single("file"), async (req, res) => {
  try {
    const assignmentId = req.params.id;
    const studentName = (req.body.studentName || "Unknown").slice(0, 80); // sanitize
    if (!req.file) return res.status(400).json({ error: "file missing" });

    // Persist submission
    const submissionId = randomUUID();
    const subDir = path.join(STORAGE_DIR, "submissions", submissionId);
    fs.mkdirSync(subDir, { recursive: true });

    const destZip = path.join(subDir, "submission.zip");
    fs.renameSync(req.file.path, destZip);
    fs.writeFileSync(path.join(subDir, "meta.json"),
      JSON.stringify({ assignmentId, studentName, createdAt: new Date().toISOString() }, null, 2)
    );

    // Enqueue grade job
    const job = await gradeQueue.add("grade", { submissionId, assignmentId, studentName }, { removeOnComplete: 1000, removeOnFail: 1000 });
    res.json({ submissionId, jobId: job.id, status: "queued" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "upload failed" });
  }
});

// Polling endpoint (UI checks status)
app.get("/api/submissions/:id/status", (req, res) => {
  const subDir = path.join(STORAGE_DIR, "submissions", req.params.id);
  const resultPath = path.join(subDir, "result.json");
  if (fs.existsSync(resultPath)) {
    const data = JSON.parse(fs.readFileSync(resultPath, "utf8"));
    return res.json({ status: "done", ...data });
  }
  if (fs.existsSync(subDir)) return res.json({ status: "queued" });
  return res.status(404).json({ error: "not found" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ API running at http://localhost:${PORT}`));