import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    herd: {
      executor: 'ramping-vus',
      stages: [
        { duration: '10s', target: 50 },
        { duration: '40s', target: 100 },
        { duration: '20s', target: 150 },
        { duration: '10s', target: 0 }
      ]
    }
  },
  thresholds: { http_req_duration: ['p(95)<300'] }
};

const BASE = __ENV.BASE_URL || 'http://localhost:3000';
const USER = __ENV.USER_EMAIL || 'student@example.com';
const PASS = __ENV.USER_PASSWORD || 'password123';

let COOKIE = null;

export default function () {
  if (!COOKIE) {
    const r = http.post(
      `${BASE}/api/login`,
      JSON.stringify({ email: USER, password: PASS }),
      { headers: { 'Content-Type': 'application/json' } }
    );
    COOKIE = r.headers['Set-Cookie'];
  }
  const res = http.get(`${BASE}/api/scoreboard`, { headers: { Cookie: COOKIE } });
  check(res, { 'ok': (r) => r.status === 200 });
  sleep(1 + Math.random());
}
