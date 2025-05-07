const fs = require('fs');
const path = require('path');

async function runAllTests() {
  console.log('\n\x1b[35m=========================================\x1b[0m');
  console.log('\x1b[35m===== QuizCraze API Test Runner =====\x1b[0m');
  console.log('\x1b[35m=========================================\x1b[0m\n');
  
  // Get all test files excluding utility files and this runner
  const testDir = __dirname;
  const files = fs.readdirSync(testDir).filter(file => {
    return (
      file.endsWith('.js') && 
      file !== 'run-tests.js' &&
      file !== 'test-utils.js'
    );
  });
  
  console.log(`Found ${files.length} test files to run.\n`);
  let allTestsPassed = true;
  
  // Run each test file
  for (const file of files) {
    console.log(`\x1b[33m==== Running tests from: ${file} ====\x1b[0m`);
    
    try {
      // Import the test runner from each file
      const testModule = require(path.join(testDir, file));
      
      // Run the tests
      const testsPassed = await testModule.runTests();
      
      if (!testsPassed) {
        allTestsPassed = false;
      }
    } catch (error) {
      console.error(`\x1b[31mError running tests from ${file}:\x1b[0m`, error);
      allTestsPassed = false;
    }
    
    console.log('\n');
  }
  
  // Final summary
  console.log('\x1b[35m=========================================\x1b[0m');
  console.log('\x1b[35m=========== OVERALL RESULTS ============\x1b[0m');
  
  if (allTestsPassed) {
    console.log('\x1b[32m✓ ALL TESTS PASSED\x1b[0m');
  } else {
    console.log('\x1b[31m✖ SOME TESTS FAILED\x1b[0m');
    process.exit(1);
  }
  
  console.log('\x1b[35m=========================================\x1b[0m\n');
}

// Run all tests
runAllTests().catch(error => {
  console.error('Test runner error:', error);
  process.exit(1);
}); 