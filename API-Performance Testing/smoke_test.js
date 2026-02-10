
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('errors');
const responseTimes = new Trend('response_times');

export const options = {
  stages: [
    { duration: '30s', target: 1 },
    { duration: '1m', target: 3 },
    { duration: '30s', target: 5 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    'http_req_duration{endpoint:products}': ['p(95) < 800'],
    'http_req_duration{endpoint:carts}': ['p(95) < 800'],
    'http_req_duration{endpoint:users}': ['p(95) < 800'],
    'http_req_failed': ['rate < 0.05'],
    'errors': ['rate < 0.05'], //threshold custom metric
  },
};

export default function () {
  const baseUrl = 'https://dummyjson.com';
  
  // 1. Test GET /products
  const productsRes = http.get(`${baseUrl}/products?limit=5`, {
    tags: { endpoint: 'products' }
  });
  
  check(productsRes, {
    'Status is 200': (r) => r.status === 200,
    'Response time < 800ms': (r) => r.timings.duration < 800,
    'Has products array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.products);
      } catch {
        return false;
      }
    },
    'Limit parameter works': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.limit === 5 && body.products.length === 5;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(productsRes.status !== 200);
  responseTimes.add(productsRes.timings.duration);
  
  //  2. Test GET /carts
  const cartsRes = http.get(`${baseUrl}/carts?limit=3`, {
    tags: { endpoint: 'carts' }
  });
  
  check(cartsRes, {
    'Status is 200': (r) => r.status === 200,
    'Response time < 800ms': (r) => r.timings.duration < 800,
    'Has carts array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.carts);
      } catch {
        return false;
      }
    },
    'Carts have data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.carts.length > 0;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(cartsRes.status !== 200);
  responseTimes.add(cartsRes.timings.duration);
  
  // 3. Test GET /users 
  const usersRes = http.get(`${baseUrl}/users?limit=3`, {
    tags: { endpoint: 'users' }
  });
  
  check(usersRes, {
    'Status is 200': (r) => r.status === 200,
    'Response time < 800ms': (r) => r.timings.duration < 800,
    'Has users array': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body.users);
      } catch {
        return false;
      }
    },
    'Users have required fields': (r) => {
      try {
        const body = JSON.parse(r.body);
        if (body.users.length > 0) {
          const user = body.users[0];
          return user.firstName && user.email;
        }
        return true;
      } catch {
        return false;
      }
    }
  });
  
  errorRate.add(usersRes.status !== 200);
  responseTimes.add(usersRes.timings.duration);
  
  // Think time
  sleep(1);
}

export function setup() {
  console.log(' Starting Smoke Test (1-5 users)');
  console.log(' Target: p95 < 800ms, error rate < 5%');
  console.log(' Testing: /products, /carts, /users endpoints');
}

export function teardown() {
  console.log('Smoke Test Completed');
  console.log('Check thresholds and custom metrics for analysis');

}

  
 
  
    
