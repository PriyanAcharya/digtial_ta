export const examBurst = {
  scenarios: {
    burst: {
      executor: 'ramping-arrival-rate',
      startRate: 5,
      timeUnit: '1s',
      preAllocatedVUs: 80,
      maxVUs: 200,
      stages: [
        { target: 100, duration: '15s' }, // ramp to 100 req/s
        { target: 150, duration: '45s' }, // peak at 150 req/s
        { target: 0, duration: '10s' }    // cool down
      ]
    }
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<2500', 'p(99)<5000']
  }
};
