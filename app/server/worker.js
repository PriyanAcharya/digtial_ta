import { Worker, QueueEvents } from "bullmq";
import "dotenv/config";
import path from "path";
import fs from "fs";
import unzipper from "unzipper";
import { spawn } from "child_process";

const REDIS_HOST = process.env.REDIS_HOST || "127.0.0.1";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);
const STORAGE_DIR = process.env.STORAGE_DIR || "./storage";

// Helper: unzip submission.zip -> workDir/src
async function unzip(zipFile, outDir) {
  await fs.promises.mkdir(outDir, { recursive: true });
  await fs.createReadStream(zipFile).pipe(unzipper.Extract({ path: outDir })).promise();
}

const worker = new Worker(
  "grade-queue",
  async (job) => {
    const { submissionId, assignmentId, studentName } = job.data;
    const subDir = path.join(STORAGE_DIR, "submissions", submissionId);
    const zipPath = path.join(subDir, "submission.zip");
    const workDir = path.join(subDir, "src");
    const start = Date.now();

    await unzip(zipPath, workDir);

    // TODO: replace with your real grading logic
    // Example “fake grader”: count files and award points
    function countFiles(dir) {
      let n = 0;
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        n += entry.isDirectory()
          ? countFiles(path.join(dir, entry.name))
          : 1;
      }
      return n;
    }

    const files = countFiles(workDir);
    const passed = files > 0;

    // You can spawn your test runner here instead:
    // const proc = spawn("python", ["-m", "pytest"], { cwd: workDir, timeout: 30_000 });

    const result = {
      submissionId,
      assignmentId,
      studentName,
      score: passed ? 10 : 0,
      maxScore: 10,
      results: [
        {
          name: "Submission contains files",
          points: passed ? 10 : 0,
          passed,
          runtime_ms: Date.now() - start,
          stdout: `files=${files}`,
          stderr: "",
        },
      ],
      finishedAt: new Date().toISOString(),
    };

    fs.writeFileSync(path.join(subDir, "result.json"), JSON.stringify(result, null, 2));
    return result;
  },
  { connection: { host: REDIS_HOST, port: REDIS_PORT }, concurrency: 30 } // ⬅ tune concurrency
);

const events = new QueueEvents("grade-queue", { connection: { host: REDIS_HOST, port: REDIS_PORT } });
events.on("completed", ({ jobId }) => console.log("✅ graded", jobId));
events.on("failed", ({ jobId, failedReason }) => console.error("❌ failed", jobId, failedReason));
console.log("Processing job:", job.id, job.data);
  return { ok: true };
console.log("👷 Worker up (concurrency=30)");
