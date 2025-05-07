const http = require('http');
const https = require('https');
const { URL } = require('url');

class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
    this.totalAssertions = 0;
    this.failedAssertions = 0;
    this.currentTestFailed = false;
  }

  // Add a test to the queue
  test(name, testFunction) {
    this.tests.push({ name, testFunction });
  }

  // Assert that two values are equal
  assertEquals(actual, expected, message = '') {
    this.totalAssertions++;
    
    if (JSON.stringify(actual) === JSON.stringify(expected)) {
      return true;
    } else {
      this.failedAssertions++;
      this.currentTestFailed = true;
      console.error(`\x1b[31m✖ ASSERTION FAILED: ${message}\x1b[0m`);
      console.error(`  Expected: ${JSON.stringify(expected)}`);
      console.error(`  Actual: ${JSON.stringify(actual)}`);
      return false;
    }
  }

  // Assert that a value is truthy
  assertTrue(value, message = '') {
    this.totalAssertions++;
    
    if (value) {
      return true;
    } else {
      this.failedAssertions++;
      this.currentTestFailed = true;
      console.error(`\x1b[31m✖ ASSERTION FAILED: ${message}\x1b[0m`);
      console.error(`  Expected truthy value but got: ${value}`);
      return false;
    }
  }

  // Assert that a value is falsy
  assertFalse(value, message = '') {
    this.totalAssertions++;
    
    if (!value) {
      return true;
    } else {
      this.failedAssertions++;
      this.currentTestFailed = true;
      console.error(`\x1b[31m✖ ASSERTION FAILED: ${message}\x1b[0m`);
      console.error(`  Expected falsy value but got: ${value}`);
      return false;
    }
  }

  // Make an HTTP request and return a promise with the response
  async request(method, url, data = null, headers = {}) {
    const parsedUrl = new URL(url);
    const options = {
      method: method.toUpperCase(),
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      timeout: 10000 // 10 second timeout
    };

    console.log(`Making ${method} request to ${url}`);
    
    const client = parsedUrl.protocol === 'https:' ? https : http;

    return new Promise((resolve, reject) => {
      try {
        const req = client.request(options, (res) => {
          let responseData = '';
          res.on('data', (chunk) => {
            responseData += chunk;
          });
          res.on('end', () => {
            try {
              console.log(`Response received from ${url} with status ${res.statusCode}`);
              const parsedData = responseData ? JSON.parse(responseData) : {};
              resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: parsedData
              });
            } catch (error) {
              console.error(`Error parsing response from ${url}:`, error.message);
              console.error(`Raw response data: ${responseData}`);
              resolve({
                statusCode: res.statusCode,
                headers: res.headers,
                body: responseData
              });
            }
          });
        });

        req.on('error', (error) => {
          console.error(`Request to ${url} failed:`, error.message);
          if (error.code === 'ECONNREFUSED') {
            console.error(`\x1b[33mConnection refused. Is the server running at ${options.hostname}:${options.port}?\x1b[0m`);
          }
          reject(error);
        });
        
        req.on('timeout', () => {
          console.error(`Request to ${url} timed out after ${options.timeout}ms`);
          req.destroy(new Error('Request timeout'));
        });

        if (data) {
          const stringData = JSON.stringify(data);
          console.log(`Request body: ${stringData.substring(0, 200)}${stringData.length > 200 ? '...' : ''}`);
          req.write(stringData);
        }
        
        req.end();
      } catch (error) {
        console.error(`Error creating request to ${url}:`, error.message);
        reject(error);
      }
    });
  }

  // Run all tests
  async runTests() {
    console.log(`\n\x1b[34m===== Running ${this.tests.length} tests =====\x1b[0m\n`);
    
    for (const test of this.tests) {
      try {
        // Reset the current test failed flag for each test
        this.currentTestFailed = false;
        
        console.log(`\x1b[36m► Running test: ${test.name}\x1b[0m`);
        await test.testFunction();
        
        // Check if any assertions failed during the test
        if (this.currentTestFailed) {
          console.error(`\x1b[31m✖ FAILED: ${test.name}\x1b[0m\n`);
          this.failed++;
        } else {
          console.log(`\x1b[32m✓ PASSED: ${test.name}\x1b[0m\n`);
          this.passed++;
        }
      } catch (error) {
        console.error(`\x1b[31m✖ FAILED: ${test.name}\x1b[0m`);
        console.error(`  Error: ${error.message}`);
        if (error.stack) {
          console.error(`  Stack: ${error.stack.split('\n')[1]}`);
        }
        console.log('');
        this.failed++;
      }
    }

    this.printSummary();
    return this.failed === 0;
  }

  // Print test summary
  printSummary() {
    console.log('\x1b[34m===============================\x1b[0m');
    console.log('\x1b[34m==== TEST SUMMARY ====\x1b[0m');
    console.log(`Total Tests: ${this.tests.length}`);
    console.log(`\x1b[32mPassed: ${this.passed}\x1b[0m`);
    console.log(`\x1b[${this.failed > 0 ? '31' : '32'}mFailed: ${this.failed}\x1b[0m`);
    console.log(`Total Assertions: ${this.totalAssertions}`);
    console.log(`\x1b[${this.failedAssertions > 0 ? '31' : '32'}mFailed Assertions: ${this.failedAssertions}\x1b[0m`);
    console.log('\x1b[34m===============================\x1b[0m\n');
  }
}

module.exports = TestRunner; 