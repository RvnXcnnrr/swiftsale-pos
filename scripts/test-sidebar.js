#!/usr/bin/env node

/**
 * Sidebar Enhancement Test Runner
 * Runs comprehensive tests for all sidebar features
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test configurations
const testConfigs = {
  unit: {
    name: 'Unit Tests',
    pattern: 'resources/pos/src/__tests__/utils/**/*.test.js',
    description: 'Tests individual utility functions and classes',
  },
  integration: {
    name: 'Integration Tests',
    pattern: 'resources/pos/src/__tests__/sidebar/**/*.test.js',
    description: 'Tests component integration and interactions',
  },
  accessibility: {
    name: 'Accessibility Tests',
    pattern: 'resources/pos/src/__tests__/accessibility/**/*.test.js',
    description: 'Tests WCAG compliance and accessibility features',
  },
  performance: {
    name: 'Performance Tests',
    pattern: 'resources/pos/src/__tests__/performance/**/*.test.js',
    description: 'Tests performance optimizations and benchmarks',
  },
};

// Utility functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(message) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Check if required dependencies are installed
function checkDependencies() {
  logHeader('Checking Dependencies');
  
  const requiredDeps = [
    '@testing-library/react',
    '@testing-library/jest-dom',
    '@testing-library/user-event',
    'jest-axe',
    'jest',
  ];
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    logError('package.json not found');
    process.exit(1);
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };
  
  const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);
  
  if (missingDeps.length > 0) {
    logError('Missing required dependencies:');
    missingDeps.forEach(dep => log(`  - ${dep}`, 'red'));
    log('\nInstall missing dependencies with:', 'yellow');
    log(`npm install --save-dev ${missingDeps.join(' ')}`, 'yellow');
    process.exit(1);
  }
  
  logSuccess('All required dependencies are installed');
}

// Run specific test suite
function runTestSuite(configKey, options = {}) {
  const config = testConfigs[configKey];
  if (!config) {
    logError(`Unknown test suite: ${configKey}`);
    return false;
  }
  
  logHeader(`Running ${config.name}`);
  logInfo(config.description);
  
  try {
    const jestArgs = [
      '--config=jest.config.sidebar.js',
      `--testPathPattern="${config.pattern}"`,
      options.coverage ? '--coverage' : '',
      options.verbose ? '--verbose' : '',
      options.watch ? '--watch' : '',
      options.updateSnapshots ? '--updateSnapshot' : '',
    ].filter(Boolean);
    
    const command = `npx jest ${jestArgs.join(' ')}`;
    logInfo(`Running: ${command}`);
    
    execSync(command, { 
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    logSuccess(`${config.name} completed successfully`);
    return true;
  } catch (error) {
    logError(`${config.name} failed`);
    return false;
  }
}

// Run all test suites
function runAllTests(options = {}) {
  logHeader('Running All Sidebar Enhancement Tests');
  
  const results = {};
  let totalPassed = 0;
  let totalFailed = 0;
  
  for (const [key, config] of Object.entries(testConfigs)) {
    const passed = runTestSuite(key, options);
    results[key] = passed;
    
    if (passed) {
      totalPassed++;
    } else {
      totalFailed++;
    }
  }
  
  // Summary
  logHeader('Test Summary');
  
  for (const [key, passed] of Object.entries(results)) {
    const config = testConfigs[key];
    if (passed) {
      logSuccess(`${config.name}: PASSED`);
    } else {
      logError(`${config.name}: FAILED`);
    }
  }
  
  log(`\nTotal: ${totalPassed + totalFailed} suites`);
  logSuccess(`Passed: ${totalPassed}`);
  if (totalFailed > 0) {
    logError(`Failed: ${totalFailed}`);
  }
  
  return totalFailed === 0;
}

// Generate test coverage report
function generateCoverageReport() {
  logHeader('Generating Coverage Report');
  
  try {
    execSync('npx jest --config=jest.config.sidebar.js --coverage --coverageReporters=html --coverageReporters=text', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    logSuccess('Coverage report generated in ./coverage directory');
    logInfo('Open ./coverage/lcov-report/index.html to view detailed coverage');
  } catch (error) {
    logError('Failed to generate coverage report');
  }
}

// Lint test files
function lintTests() {
  logHeader('Linting Test Files');
  
  try {
    execSync('npx eslint "resources/pos/src/__tests__/**/*.js" --fix', {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    
    logSuccess('Test files linted successfully');
  } catch (error) {
    logWarning('Linting completed with warnings/errors');
  }
}

// Main CLI handler
function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  
  // Parse options
  const options = {
    coverage: args.includes('--coverage'),
    verbose: args.includes('--verbose'),
    watch: args.includes('--watch'),
    updateSnapshots: args.includes('--updateSnapshot'),
  };
  
  // Check dependencies first
  checkDependencies();
  
  switch (command) {
    case 'unit':
    case 'integration':
    case 'accessibility':
    case 'performance':
      runTestSuite(command, options);
      break;
      
    case 'all':
    case undefined:
      runAllTests(options);
      break;
      
    case 'coverage':
      generateCoverageReport();
      break;
      
    case 'lint':
      lintTests();
      break;
      
    case 'help':
      showHelp();
      break;
      
    default:
      logError(`Unknown command: ${command}`);
      showHelp();
      process.exit(1);
  }
}

// Show help information
function showHelp() {
  logHeader('Sidebar Enhancement Test Runner');
  
  log('Usage: node scripts/test-sidebar.js [command] [options]');
  log('');
  log('Commands:');
  log('  all           Run all test suites (default)');
  log('  unit          Run unit tests only');
  log('  integration   Run integration tests only');
  log('  accessibility Run accessibility tests only');
  log('  performance   Run performance tests only');
  log('  coverage      Generate coverage report');
  log('  lint          Lint test files');
  log('  help          Show this help message');
  log('');
  log('Options:');
  log('  --coverage        Include coverage reporting');
  log('  --verbose         Verbose test output');
  log('  --watch           Watch mode for development');
  log('  --updateSnapshot  Update test snapshots');
  log('');
  log('Examples:');
  log('  node scripts/test-sidebar.js                    # Run all tests');
  log('  node scripts/test-sidebar.js unit --coverage    # Run unit tests with coverage');
  log('  node scripts/test-sidebar.js accessibility      # Run accessibility tests only');
  log('  node scripts/test-sidebar.js all --watch        # Run all tests in watch mode');
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  runTestSuite,
  runAllTests,
  generateCoverageReport,
  lintTests,
};
