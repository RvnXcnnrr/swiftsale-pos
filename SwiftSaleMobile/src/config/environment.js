// Environment configuration for different deployment stages

const environments = {
  development: {
    API_BASE_URL: 'http://192.168.1.6:8000/api', // Update this with your local IP
    DEBUG: true,
    ENABLE_LOGGING: true,
  },
  staging: {
    API_BASE_URL: 'https://staging.swiftsale.com/api',
    DEBUG: false,
    ENABLE_LOGGING: true,
  },
  production: {
    API_BASE_URL: 'https://api.swiftsale.com/api',
    DEBUG: false,
    ENABLE_LOGGING: false,
  },
};

// Determine current environment
const getCurrentEnvironment = () => {
  // You can change this to 'staging' or 'production' as needed
  return 'development';
};

const currentEnv = getCurrentEnvironment();
const config = environments[currentEnv];

export default {
  ...config,
  ENVIRONMENT: currentEnv,
  
  // App configuration
  APP_NAME: 'SwiftSale Mobile',
  APP_VERSION: '1.0.0',
  
  // API configuration
  API_TIMEOUT: 30000,
  
  // Cache configuration
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  
  // Offline configuration
  MAX_OFFLINE_SALES: 50,
  SYNC_INTERVAL: 30000, // 30 seconds
  
  // UI configuration
  ITEMS_PER_PAGE: 20,
  MAX_CART_ITEMS: 100,
  
  // Feature flags
  FEATURES: {
    BARCODE_SCANNER: true,
    OFFLINE_MODE: true,
    RECEIPT_PRINTING: true,
    CUSTOMER_MANAGEMENT: true,
    ANALYTICS: true,
  },
};

// Helper function to get API URL
export const getApiUrl = (endpoint = '') => {
  return `${config.API_BASE_URL}${endpoint}`;
};

// Helper function to check if feature is enabled
export const isFeatureEnabled = (feature) => {
  return config.FEATURES[feature] || false;
};

// Helper function for logging
export const log = (message, data = null) => {
  if (config.ENABLE_LOGGING) {
    console.log(`[SwiftSale Mobile] ${message}`, data);
  }
};

// Helper function for error logging
export const logError = (message, error = null) => {
  if (config.ENABLE_LOGGING) {
    console.error(`[SwiftSale Mobile Error] ${message}`, error);
  }
};
