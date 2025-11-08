import { NextRequest, NextResponse } from "next/server";
import Busboy from "busboy";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";
import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";

const prisma = new PrismaClient();
export const runtime = "nodejs";

function toNodeReadable(stream: ReadableStream<Uint8Array>) {
  // @ts-ignore
  return Readable.fromWeb ? Readable.fromWeb(stream) : (stream as any);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const assignmentId = Number(params.id);
  if (!assignmentId)
    return NextResponse.json({ error: "Bad assignment ID" }, { status: 400 });

  // temporary: using static student (for testing)
  const student = await prisma.user.findFirst({
    where: { username: "student@example.com" },
  });
  if (!student)
    return NextResponse.json({ error: "No student found" }, { status: 400 });

  const submission = await prisma.submission.create({
    data: {
      assignmentId,
      studentId: student.id,
      status: "RECEIVED",
    },
  });

  const uploadDir = path.join(
    process.cwd(),
    "uploads",
    "submissions",
    String(submission.id)
  );
  await fsp.mkdir(uploadDir, { recursive: true });

  const contentType = req.headers.get("content-type") || "";
  if (!contentType.startsWith("multipart/form-data"))
    return NextResponse.json({ error: "Expected multipart/form-data" }, { status: 415 });

  const nodeStream = toNodeReadable(req.body!);
  const busboy = Busboy({ headers: { "content-type": contentType } });

  const savedFiles: { name: string; size: number; storagePath: string }[] = [];
  const writePromises: Promise<void>[] = [];

  busboy.on("file", (fieldname, file, filename) => {
    const safeName = filename.replace(/[\\/:*?\"<>|]/g, "_") || "file.bin";
    const destPath = path.join(uploadDir, safeName);
    const writeStream = fs.createWriteStream(destPath);
    let size = 0;

    file.on("data", (chunk) => {
      size += chunk.length;
    });

    const promise = new Promise<void>((resolve, reject) => {
      writeStream.on("finish", () => {
        savedFiles.push({
          name: safeName,
          size,
          storagePath: `uploads/submissions/${submission.id}/${safeName}`,
        });
        resolve();
      });
      writeStream.on("error", reject);
      file.pipe(writeStream);
    });

    writePromises.push(promise);
  });

  const done = new Promise<void>((resolve, reject) => {
    busboy.on("finish", resolve);
    busboy.on("error", reject);
  });

  nodeStream.pipe(busboy);
  await done;
  await Promise.all(writePromises);

  await prisma.$transaction([
    prisma.submission.update({
      where: { id: submission.id },
      data: { status: "STORED" },
    }),
    prisma.submissionFile.createMany({
      data: savedFiles.map((f) => ({
        submissionId: submission.id,
        name: f.name,
        sizeBytes: f.size,
        storagePath: f.storagePath,
      })),
    }),
  ]);

  return NextResponse.json({
    ok: true,
    submissionId: submission.id,
    files: savedFiles.length,
  });
}
