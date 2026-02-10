import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Trend, Rate, Counter } from 'k6/metrics';

// ====================
// CUSTOM METRICS
// ====================
const loginDuration = new Trend('login_duration');
const productsDuration = new Trend('products_duration');
const cartDuration = new Trend('cart_duration');
const errorRate = new Rate('errors');
const successCounter = new Counter('successful_requests');

// ====================
// CONFIGURATION OPTIONS
// ====================
export const options = {
  scenarios: {
    // 1. SMOKE TEST - Basic validation
    smoke: {
      executor: 'constant-vus',
      vus: 3,
      duration: '30s',
      tags: { test_type: 'smoke' },
      exec: 'smokeTest',
    },
    
    // 2. LOAD TEST - Normal operation
    load: {
      executor: 'ramping-vus',
      startVUs: 5,
      stages: [
        { duration: '30s', target: 20 },  // Ramp up to 20 users
        { duration: '1m', target: 20 },   // Stay at 20
        { duration: '30s', target: 50 },  // Increase to 50
        { duration: '2m', target: 50 },   // Stay at 50
        { duration: '30s', target: 0 },   // Ramp down
      ],
      gracefulRampDown: '30s',
      tags: { test_type: 'load' },
      exec: 'loadTest',
    },
    
    // 3. STRESS TEST - Find breaking point
    stress: {
      executor: 'ramping-arrival-rate',
      startRate: 10,
      timeUnit: '1s',
      preAllocatedVUs: 10,
      maxVUs: 100,
      stages: [
        { duration: '30s', target: 50 },   // 50 reqs/sec
        { duration: '1m', target: 100 },   // 100 reqs/sec
        { duration: '30s', target: 150 },  // 150 reqs/sec
        { duration: '30s', target: 200 },  // 200 reqs/sec
        { duration: '30s', target: 0 },    // Cool down
      ],
      tags: { test_type: 'stress' },
      exec: 'stressTest',
    },
  },
  
  // THRESHOLDS - Pass/Fail criteria
  thresholds: {
    // Global thresholds
    http_req_duration: [
      { threshold: 'p(95) < 1000', abortOnFail: false }, // 95% < 1s
      { threshold: 'p(99) < 2000', abortOnFail: false }, // 99% < 2s
    ],
    http_req_failed: ['rate < 0.05'], // Error rate < 5%
    
    // Endpoint-specific thresholds
    'login_duration': ['p(95) < 800'],
    'products_duration': ['p(95) < 600'],
    'cart_duration': ['p(95) < 1000'],
    'errors': ['rate < 0.01'],
  },
  
  // OTHER SETTINGS
  discardResponseBodies: false, // Keep response bodies for validation
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
  summaryTimeUnit: 'ms',
};

// ====================
// TEST DATA & CONFIG
// ====================
const BASE_URL = 'https://dummyjson.com';
const users = [
  { username: 'emilys', password: 'emilyspass' },
  { username: 'atuny0', password: '9uQFF1Lh' },
];

// Helper function to get random user
function getRandomUser() {
  return users[Math.floor(Math.random() * users.length)];
}

// ====================
// API ENDPOINT FUNCTIONS
// ====================

// 1. LOGIN ENDPOINT
function login() {
  const user = getRandomUser();
  const payload = JSON.stringify({
    username: user.username,
    password: user.password,
    expiresInMins: 30,
  });
  
  const headers = { 'Content-Type': 'application/json' };
  const startTime = Date.now();
  
  const res = http.post(`${BASE_URL}/auth/login`, payload, { headers });
  const duration = Date.now() - startTime;
  loginDuration.add(duration);
  
  const checkResult = check(res, {
    'Login status is 200': (r) => r.status === 200,
    'Login response has token': (r) => {
      const json = r.json();
      return json && json.accessToken && json.refreshToken;
    },
    'Login response time < 800ms': () => duration < 800,
  });
  
  if (!checkResult) {
    errorRate.add(1);
    console.error(`Login failed: ${res.status} - ${res.body}`);
  } else {
    successCounter.add(1);
  }
  
  return res.status === 200 ? res.json().accessToken : null;
}

// 2. GET PRODUCTS ENDPOINT
function getProducts(accessToken) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };
  
  const startTime = Date.now();
  const res = http.get(`${BASE_URL}/products?limit=5`, { headers });
  const duration = Date.now() - startTime;
  productsDuration.add(duration);
  
  const checkResult = check(res, {
    'Products status is 200': (r) => r.status === 200,
    'Products list returned': (r) => {
      const json = r.json();
      return json && json.products && json.products.length > 0;
    },
    'Products response time < 600ms': () => duration < 600,
  });
  
  if (!checkResult) {
    errorRate.add(1);
  } else {
    successCounter.add(1);
  }
  
  return res.status === 200 ? res.json().products[0].id : 1;
}

// 3. CREATE CART ENDPOINT
function createCart(accessToken, productId) {
  const payload = JSON.stringify({
    userId: Math.floor(Math.random() * 10) + 1,
    products: [{ id: productId, quantity: Math.floor(Math.random() * 3) + 1 }],
  });
  
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  
  const startTime = Date.now();
  const res = http.post(`${BASE_URL}/carts/add`, payload, { headers });
  const duration = Date.now() - startTime;
  cartDuration.add(duration);
  
  const checkResult = check(res, {
    'Cart status is 200': (r) => r.status === 200,
    'Cart created successfully': (r) => {
      const json = r.json();
      return json && json.id && json.products;
    },
    'Cart response time < 1000ms': () => duration < 1000,
  });
  
  if (!checkResult) {
    errorRate.add(1);
  } else {
    successCounter.add(1);
  }
}

// ====================
// TEST SCENARIOS
// ====================

export function smokeTest() {
  group('Smoke Test - Basic API Validation', () => {
    // Test 1: Login
    const token = login();
    sleep(0.5);
    
    if (token) {
      // Test 2: Get Products
      const productId = getProducts(token);
      sleep(0.5);
      
      // Test 3: Create Cart
      createCart(token, productId);
    }
  });
}

export function loadTest() {
  group('Load Test - Simulated User Workflow', () => {
    // 1. Login
    const token = login();
    if (!token) {
      console.error('Login failed, skipping remaining tests');
      return;
    }
    
    // Random think time between actions (1-3 seconds)
    sleep(Math.random() * 2 + 1);
    
    // 2. Browse Products
    const productId = getProducts(token);
    sleep(Math.random() * 2 + 1);
    
    // 3. Add to Cart
    createCart(token, productId);
  });
}

export function stressTest() {
  group('Stress Test - Maximum Throughput', () => {
    // Execute all three endpoints in sequence
    const token = login();
    if (token) {
      const productId = getProducts(token);
      createCart(token, productId);
    }
  });
}

// ====================
// SETUP & TEARDOWN
// ====================

export function setup() {
  console.log('🚀 Starting K6 Performance Test Suite');
  console.log('======================================');
  console.log('Test Profiles:');
  console.log('1. Smoke Test: 3 VUs for 30s');
  console.log('2. Load Test: 5 → 50 VUs over 4m');
  console.log('3. Stress Test: Up to 200 req/sec');
  console.log('======================================\n');
  
  return {
    startTime: new Date().toISOString(),
    baseUrl: BASE_URL,
  };
}

export function teardown(data) {
  console.log('\n======================================');
  console.log('✅ Test Suite Completed');
  console.log(`Started at: ${data.startTime}`);
  console.log('======================================');
}