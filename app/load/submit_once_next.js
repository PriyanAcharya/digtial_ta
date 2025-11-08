import http from "k6/http";
import { check, sleep } from "k6";

const SUBS = Number(__ENV.SUBS || 100);

export const options = {
  scenarios: {
    oneShot: {
      executor: "per-vu-iterations",
      vus: SUBS,
      iterations: 1,
      maxDuration: "2m",
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],
    http_req_duration: ["p(95)<5000","p(99)<8000"]
  },
};

const BASE = __ENV.BASE_URL || "http://web:3000";

export default function () {
  // list assignments, pick first
  const list = http.get(`${BASE}/api/assignments`);
  check(list, { "assignments 200": (r) => r.status === 200 });
  const items = list.json();
  const assignmentId = (items && items[0] && (items[0].id || items[0].ID)) || 1;

  // pick random zip
  const i = Math.floor(Math.random()*500)+1;
  const filePath = `/scripts/data/sub_${i}.zip`;
  const payload = { files: http.file(filePath, "folder.zip", "application/zip") };

  // submit
  const res = http.post(`${BASE}/api/assignments/${assignmentId}/submit`, payload, { timeout: "60s" });
  check(res, { "upload 2xx": (r) => r.status >= 200 && r.status < 300 });
  sleep(Math.random()*0.5);
}
