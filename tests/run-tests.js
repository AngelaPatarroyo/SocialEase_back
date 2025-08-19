#!/usr/bin/env node

/**
 * Comprehensive Test Runner
 * Runs all test suites with proper organization and reporting
 */

const { spawn } = require('child_process');
const path = require('path');

// Test configuration
const testConfig = {
  unit: {
    pattern: 'tests/unit/**/*.test.js',
    description: 'Unit Tests',
    timeout: 10000
  },
  integration: {
    pattern: 'tests/integration/**/*.test.js',
    description: 'Integration Tests',
    timeout: 30000
  },
  api: {
    pattern: 'tests/api/**/*.test.js',
    description: 'API Tests',
    timeout: 45000
  },
  e2e: {
    pattern: 'tests/e2e/**/*.test.js',
    description: 'End-to-End Tests',
    timeout: 60000
  }
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runTestSuite(testType, config) {
  return new Promise((resolve, reject) => {
    log(`\n🚀 Running ${config.description}...`, 'blue');
    log(`📁 Pattern: ${config.pattern}`, 'cyan');
    log(`⏱️  Timeout: ${config.timeout}ms`, 'yellow');

    const jestProcess = spawn('npx', [
      'jest',
      config.pattern,
      '--testTimeout=' + config.timeout,
      '--verbose',
      '--forceExit',
      '--detectOpenHandles',
      '--maxWorkers=1'
    ], {
      stdio: 'pipe',
      env: {
        ...process.env,
        NODE_ENV: 'test',
        CI: 'true'
      }
    });

    let output = '';
    let errorOutput = '';

    jestProcess.stdout.on('data', (data) => {
      output += data.toString();
      process.stdout.write(data);
    });

    jestProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
      process.stderr.write(data);
    });

    jestProcess.on('close', (code) => {
      if (code === 0) {
        log(`✅ ${config.description} completed successfully!`, 'green');
        resolve({ success: true, output, errorOutput });
      } else {
        log(`❌ ${config.description} failed with code ${code}`, 'red');
        resolve({ success: false, output, errorOutput, code });
      }
    });

    jestProcess.on('error', (error) => {
      log(`💥 Error running ${config.description}: ${error.message}`, 'red');
      reject(error);
    });
  });
}

async function runAllTests() {
  log('🧪 Starting Comprehensive Test Suite', 'bright');
  log('=' * 50, 'cyan');

  const results = {};
  let totalTests = 0;
  let passedTests = 0;

  // Run each test suite
  for (const [testType, config] of Object.entries(testConfig)) {
    try {
      const result = await runTestSuite(testType, config);
      results[testType] = result;
      
      if (result.success) {
        passedTests++;
      }
      totalTests++;
      
      // Add delay between test suites
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      log(`💥 Failed to run ${config.description}: ${error.message}`, 'red');
      results[testType] = { success: false, error: error.message };
      totalTests++;
    }
  }

  // Generate summary report
  log('\n📊 Test Summary Report', 'bright');
  log('=' * 50, 'cyan');

  Object.entries(results).forEach(([testType, result]) => {
    const config = testConfig[testType];
    const status = result.success ? '✅ PASSED' : '❌ FAILED';
    const color = result.success ? 'green' : 'red';
    
    log(`${status} - ${config.description}`, color);
    
    if (!result.success && result.code) {
      log(`   Exit Code: ${result.code}`, 'yellow');
    }
  });

  log('\n' + '=' * 50, 'cyan');
  log(`Total Test Suites: ${totalTests}`, 'blue');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${totalTests - passedTests}`, 'red');
  log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`, 'bright');

  // Exit with appropriate code
  const allPassed = passedTests === totalTests;
  process.exit(allPassed ? 0 : 1);
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('🧪 Comprehensive Test Runner', 'bright');
  log('Usage: node tests/run-tests.js [options]', 'cyan');
  log('\nOptions:', 'yellow');
  log('  --help, -h     Show this help message');
  log('  --unit         Run only unit tests');
  log('  --integration  Run only integration tests');
  log('  --api          Run only API tests');
  log('  --e2e          Run only end-to-end tests');
  log('\nExamples:', 'yellow');
  log('  node tests/run-tests.js              # Run all tests');
  log('  node tests/run-tests.js --unit       # Run only unit tests');
  log('  node tests/run-tests.js --api --e2e  # Run API and E2E tests');
  process.exit(0);
}

// Filter test suites based on arguments
if (args.length > 0) {
  const filteredConfig = {};
  args.forEach(arg => {
    if (testConfig[arg.replace('--', '')]) {
      const key = arg.replace('--', '');
      filteredConfig[key] = testConfig[key];
    }
  });
  
  if (Object.keys(filteredConfig).length > 0) {
    Object.assign(testConfig, filteredConfig);
  }
}

// Run the tests
runAllTests().catch(error => {
  log(`💥 Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});
