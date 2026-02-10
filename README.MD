Project Overview
Comprehensive testing project evaluating two systems:

Swag Labs: React-based e-commerce demo application
DummyJSON: REST API service for testing practice

Testing Objectives

Assess production readiness of both systems
Identify functional defects and performance bottlenecks
Validate API reliability and scalability
Establish automation framework for regression testing

Project Structure

Final_Project/
├── 📄 Final_Report.md           # Complete 35-page test report
├── 📊 Presentation/             # 11-slide presentation
├── 🧪 Testing_Artifacts/
│   ├── Manual_Testing/
│   │   ├── test_cases.xlsx     # 20 manual test cases
│   │   └── bug_report.xlsx     # 10 documented defects
│   ├── API_Testing/
│   │   ├── postman_collection.json
│   │   ├── postman_environment.json
│   │   └── newman_results.xml
│   ├── Performance_Testing/
│   │   ├── k6_scripts.js
│   │   └── performance_results/
│   └── UI_Automation/
│       ├── MyTestCases.java
│       └── testng_results.xml
├── 📸 Visual_Evidence/
│   ├── bug_screenshots/        # 5 critical bug images
│   └── test_reports/           # TestNG, Newman reports
└── 📚 Documentation/
    ├── Test_Plan.md
    └── README.md               # This file

    Tools & Technologies Used

    Testing Tools:

Manual Testing: Excel test cases, exploratory testing
API Testing: Postman, Newman for automation
Performance Testing: k6 for load and stress testing
UI Automation: Selenium WebDriver, TestNG, Java
Browser: Microsoft Edge
IDE: Eclipse

Key Dependencies:

Java 11+
Selenium 4.0+
TestNG 7.8+
Postman/Newman
k6 0.50.0+

Key Results Summary

Success Metrics:
API Testing: 100% success rate (60/60 requests)
Performance: 0% errors under 25 concurrent users
UI Automation: 100% pass rate for enabled tests
Manual Testing: 70% pass rate, 6 critical defects found

Critical Findings (Swag Labs):

Data Leakage: Cart persists across different users
Checkout Bypass: Empty cart purchases allowed
Form Dysfunction: Last Name field not editable
Price Inconsistency: Different prices across pages
UI Issues: Missing quantity controls, non-functional buttons

DummyJSON API Assessment:

Production Ready: 100% reliability
Performance: <200ms average response tim
Scalability: Linear performance under load
Recommendation: Ready for immediate deployment

How to Execute Tests

API Tests:
# Run Newman tests
newman run "DummyJSON_API.postman_collection.json" -e "environment.json"

# Generate reports
newman run collection.json --reporters cli,html,json

Performance Tests:
# Smoke test
k6 run smoke_test.js

# Load test
k6 run load_test.js

UI Automation:
# Run all tests
mvn test -Dtest=MyTestCases

# Generate report
mvn surefire-report:report

Test Coverage

Functional Coverage:

Authentication: 100%
Product Management: 85%
Cart Operations: 90%
Checkout Process: 95%
Navigation: 100%

User Journeys Tested:

Login → Browse → Select → Cart → Checkout → Complete
Multiple user session management
Error handling and recovery
Cross-tab navigation
Form validation and submission

Defect Statistics
 
Severity	 Count	     Status
Critical       2	      Open
High	       4	      Open
Medium	       3	      Open
Low.       	1	          Open
Total       	10	      All Open

Recommendations

Immediate Actions (Week 1):
Fix session isolation and cart persistence bugs
Implement proper checkout validation
Restore Last Name field functionality

Short-term (Week 2-3):
Fix price consistency across pages
Add quantity controls to cart UI
Resolve user-specific UI issues

Long-term (Month 1):
Implement Page Object Model for automation
Enhance test reporting and metrics
Integrate with CI/CD pipeline

Report Contents
The final report includes:

Executive Summary
System Under Test + Assumptions
Test Strategy and Scope
Manual Testing Results
Defects Analysis
API Testing Results
Performance Testing Results
UI Automation Framework
Risks, Limitations & Recommendations
Appendix with Visual Evidence

Acknowledgments

Supervisors:
Dr. Ashraf Al Smadi
Mr. Brandon Copeland

Institution:
Al Hussein Technical University
Quality Assurance Program

Student:
Baraa Hussien Abukhamesh

