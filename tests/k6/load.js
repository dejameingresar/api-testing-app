import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 10 },
    { duration: "1m", target: 10 },
    { duration: "20s", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<500"]
  }
};

const BASE = __ENV.BASE_URL || "http://localhost:3000";

export default function () {
  const r1 = http.get(`${BASE}/health`);
  check(r1, { "health 200": (r) => r.status === 200 });

  const r2 = http.get(`${BASE}/api/items`);
  check(r2, { "list 200": (r) => r.status === 200 });

  const r3 = http.post(
    `${BASE}/api/items`,
    JSON.stringify({ name: "k6-item" }),
    { headers: { "Content-Type": "application/json" } }
  );
  check(r3, { "create 201": (r) => r.status === 201 });

  sleep(1);
}
