import http from 'k6/http';
import { check, sleep } from 'k6';
import { examBurst } from './options.js';

export const options = examBurst;

// With `network_mode: service:web`, localhost:3000 reaches your web container.
// If not using that, set BASE_URL=http://localhost:3000 when running.
const BASE = __ENV.BASE_URL || 'http://localhost:3000';
const USER = __ENV.USER_EMAIL || 'student@example.com';
const PASS = __ENV.USER_PASSWORD || 'password123';

export default function () {
  // 1) Login — expects Set-Cookie session
  const loginRes = http.post(
    `${BASE}/api/login`,
    JSON.stringify({ email: USER, password: PASS }),
    { headers: { 'Content-Type': 'application/json' }, redirects: 0 }
  );
  check(loginRes, { 'login 200/204/302': (r) => [200, 204, 302].includes(r.status) });
  const cookie = loginRes.headers['Set-Cookie'];

  // 2) List assignments, pick first id
  const list = http.get(`${BASE}/api/assignments`, { headers: { Cookie: cookie } });
  check(list, { 'assignments 200': (r) => r.status === 200 });
  const items = list.json();
  const assignmentId =
    (items && items[0] && (items[0].id || items[0].ID || items[0].uuid)) || '1';

  // 3) Upload submission (multipart; field name 'file')
  const idx = Math.floor(Math.random() * 500) + 1;
  const filePath = `/scripts/data/sub_${idx}.zip`;
  const payload = { file: http.file(filePath, 'code.zip', 'application/zip') };

  const up = http.post(
    `${BASE}/api/assignments/${assignmentId}/submit`,
    payload,
    { headers: { Cookie: cookie }, timeout: '60s' }
  );
  check(up, { 'upload accepted 2xx': (r) => r.status >= 200 && r.status < 300 });

  sleep(Math.random() * 2);
}
