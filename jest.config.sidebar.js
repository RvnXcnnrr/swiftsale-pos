/**
 * Jest Configuration for Sidebar Enhancement Tests
 */

module.exports = {
  // Test environment
  testEnvironment: 'jsdom',

  // Setup files
  setupFilesAfterEnv: [
    '<rootDir>/resources/pos/src/__tests__/setup/testSetup.js'
  ],

  // Test file patterns
  testMatch: [
    '<rootDir>/resources/pos/src/__tests__/**/*.test.js',
    '<rootDir>/resources/pos/src/__tests__/**/*.test.jsx'
  ],

  // Coverage configuration
  collectCoverageFrom: [
    'resources/pos/src/components/sidebar/**/*.{js,jsx}',
    'resources/pos/src/contexts/**/*.{js,jsx}',
    'resources/pos/src/utils/advancedSearch.js',
    'resources/pos/src/utils/sidebarAnalytics.js',
    'resources/pos/src/components/VirtualizedMenu.js',
    '!**/node_modules/**',
    '!**/*.test.{js,jsx}',
    '!**/coverage/**'
  ],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './resources/pos/src/components/sidebar/': {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85
    },
    './resources/pos/src/utils/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },

  // Module name mapping
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/resources/pos/src/$1',
    '^@components/(.*)$': '<rootDir>/resources/pos/src/components/$1',
    '^@utils/(.*)$': '<rootDir>/resources/pos/src/utils/$1',
    '^@contexts/(.*)$': '<rootDir>/resources/pos/src/contexts/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/resources/pos/src/__tests__/__mocks__/fileMock.js'
  },

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.css$': '<rootDir>/resources/pos/src/__tests__/__mocks__/cssTransform.js'
  },

  // Module file extensions
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],

  // Test timeout
  testTimeout: 10000,

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,

  // Global variables
  globals: {
    'process.env.NODE_ENV': 'test'
  },

  // Test environment options
  testEnvironmentOptions: {
    url: 'http://localhost'
  }
};
