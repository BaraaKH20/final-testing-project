DummyJSON API Testing Project

Project Overview
Comprehensive API testing suite for DummyJSON REST API using Postman, Newman, and data-driven testing methodologies.

 Objectives
- [x] Test ≥20 REST API operations
- [x] Implement positive & negative test scenarios  
- [x] Create data-driven tests with CSV
- [x] Set up Postman Environments
- [x] Automate tests with Newman CLI
- [x] Generate HTML/JUnit test reports

 Project Structure

 DummyJSON_API_Testing/
├── README.md # This file
├── DummyJSON_API.postman_collection.json # Postman Collection (22 requests)
├── DummyJSON_Env.postman_environment.json # Environment variables
├── products_test_data.csv # Test data for data-driven tests
├── run_tests.sh # Automation script
├── reports/ # Test reports
 ├── newman_report.html # HTML test report
 └── junit_report.xml # JUnit report for CI/CD



Test Coverage

 Authentication Folder (3 requests)
1. `POST /auth/login` - User authentication
2. `GET /auth/me` - Get current user info
3. `POST /auth/refresh` - Refresh access token

 
Products Folder (8 requests)

Positive Tests:

4. `GET /products` - List products with pagination
5. `GET /products/{id}` - Get product details
6. `GET /products/search` - Search products
7. `POST /products/add` - Create new product
8. `PUT /products/{id}` - Update product
9. `DELETE /products/{id}` - Delete product

Negative Tests:

10. `GET /products/999999` - Non-existent product (404)
11. `GET /products/999999` - Duplicate negative test

 Carts Folder (4 requests)

12. `GET /carts` - List carts
13. `GET /carts/{id}` - Get cart details
14. `GET /carts/user/{userId}` - User's carts
15. `POST /carts/add` - Create new cart

 Users Folder (5 requests)

16. `GET /users` - List users
17. `GET /users/{id}` - Get user details
18. `GET /users/search` - Search users
19. `POST /users/add` - Create new user
20. `PUT /users/{id}` - Update user

 Data-Driven Tests

21. `GET /products/{id}` - CSV-driven test (3 iterations)
   - Tests valid products (IDs: 1, 2)
   - Tests non-existent product (ID: 999999)


 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `access_token` | JWT access token | `eyJhbGci...` |
| `refresh_token` | JWT refresh token | `eyJhbGci...` |
| `user_id` | Authenticated user ID | `15` |
| `product_id` | Product ID for testing | `1` |
| `cart_id` | Cart ID for testing | `1` |
| `created_product_id` | Newly created product ID | `101` |

 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [Postman](https://www.postman.com/) (optional for manual testing)
- Git (for version control)

# Installation
```bash
# Install Newman CLI globally
npm install -g newman

# Install HTML reporter
npm install -g newman-reporter-htmlextra

# Install JUnit reporter
npm install -g newman-reporter-junit

Running Tests
Option 1: Run all tests (Recommended)

chmod +x run_tests.sh
./run_tests.sh

Option 2: Run manually

# Run full collection test
newman run DummyJSON_API.postman_collection.json \
  -e DummyJSON_Env.postman_environment.json \
  -r htmlextra,cli \
  --reporter-htmlextra-export reports/newman_report.html

# Run data-driven tests
newman run DummyJSON_API.postman_collection.json \
  -d products_test_data.csv \
  --iteration-count 3 \
  -r htmlextra \
  --reporter-htmlextra-export reports/data_driven_report.html

  Test Data
CSV File Format (products_test_data.csv)
product_id,expected_status
1,200
2,200
999999,404

Test Scenarios Covered

Valid Product Retrieval - ID 1 & 2 (should return 200)
Non-existent Product - ID 999999 (should return 404)

Test Results

Success Criteria
✅ All 20+ API requests execute successfully
✅ Positive tests return expected 2xx status codes
✅ Negative tests return expected 4xx status codes
✅ Data-driven tests validate multiple scenarios
✅ Environment variables persist across requests
✅ Response times under 2 seconds

Technical Implementation:

Postman Features Used >>
1.Collection Variables - For data sharing between requests
2.Environment Variables - For sensitive/configuration data
3.Test Scripts - JavaScript validation for each response
4.Pre-request Scripts - Setup and data preparation
5.Data Files - CSV for data-driven testing

Testing Strategies:

1.Positive Testing - Valid inputs, expected success
2.Negative Testing - Invalid inputs, expected errors
3.Data-Driven Testing - Multiple test cases from CSV
4.Workflow Testing - Sequence of API calls (auth → products → carts)


🔗 Resources
DummyJSON API Documentation
Postman Learning Center
Newman Documentation
GitHub Repository


 Contributors
Baraa Abukhamseh- API Testing Engineer

 License
This project is for educational/testing purposes. DummyJSON is a free mock API service.








