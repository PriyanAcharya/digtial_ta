import crypto from "crypto";

const enc = (obj: any) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const dec = (b64: string) => JSON.parse(Buffer.from(b64, "base64url").toString("utf8"));

function hmac(data: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(data).digest("base64url");
}

/** Create a very small HS256 JWT */
export function signJWT(payload: any, secret: string, expiresInSeconds = 60 * 60 * 24 * 7) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = { iat: now, exp: now + expiresInSeconds, ...payload };
  const head = enc(header);
  const pay = enc(body);
  const sig = hmac(`${head}.${pay}`, secret);
  return `${head}.${pay}.${sig}`;
}

export function verifyJWT(token: string, secret: string) {
  const [head, pay, sig] = token.split(".");
  if (!head || !pay || !sig) throw new Error("bad token format");
  const expected = hmac(`${head}.${pay}`, secret);
  if (expected !== sig) throw new Error("bad signature");
  const payload = dec(pay);
  if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
    throw new Error("expired");
  }
  return payload;
}

/** Parse the Cookie header into a map */
export function parseCookies(cookieHeader: string | null | undefined) {
  const out: Record<string,string> = {};
  if (!cookieHeader) return out;
  cookieHeader.split(";").forEach(p => {
    const [k, ...v] = p.trim().split("=");
    if (k) out[k] = decodeURIComponent(v.join("="));
  });
  return out;
}
