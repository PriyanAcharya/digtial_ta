/**
 * Dual backend:
 * - If USE_RAPIDAPI_JUDGE0=true -> use RapidAPI Judge0
 * - Else -> use local Judge0 (JUDGE0 base URL)
 */
export type Judge0Response = {
  stdout?: string;
  stderr?: string;
  time?: string;
  memory?: number;
  compile_output?: string;
  status?: { id: number; description: string };
};

export async function runPython(code: string, stdin: string) {
  const useRapid = process.env.USE_RAPIDAPI_JUDGE0 === "true";

  if (useRapid) {
    const base = process.env.RAPIDAPI_BASE_URL as string;
    const host = process.env.RAPIDAPI_HOST as string;
    const key = process.env.RAPIDAPI_KEY as string;

    const res = await fetch(`${base}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": host,
        "x-rapidapi-key": key,
      },
      body: JSON.stringify({
        language_id: 71, // Python 3.x
        source_code: code,
        stdin,
        redirect_stderr_to_stdout: true,
      }),
    });
    if (!res.ok) throw new Error(`Judge0 RapidAPI error: ${res.status}`);
    return (await res.json()) as Judge0Response;
  } else {
    const base = process.env.JUDGE0 as string;
    const res = await fetch(`${base}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        language_id: 71,
        source_code: code,
        stdin,
        redirect_stderr_to_stdout: true,
      }),
    });
    if (!res.ok) throw new Error(`Judge0 error: ${res.status}`);
    return (await res.json()) as Judge0Response;
  }
}
