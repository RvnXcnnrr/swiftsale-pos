import config from '../config/environment';

// API Configuration
export const API_CONFIG = {
  // Backend URL is now configured in environment.js
  BASE_URL: config.API_BASE_URL,
  TIMEOUT: config.API_TIMEOUT,
  
  // API Endpoints
  ENDPOINTS: {
    // Authentication
    LOGIN: '/login',
    LOGOUT: '/logout',
    REFRESH: '/refresh',
    
    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_BARCODE: '/products/barcode',
    CATEGORIES: '/product-categories',
    BRANDS: '/brands',
    
    // Customers
    CUSTOMERS: '/customers',
    
    // Sales
    SALES: '/sales',
    DASHBOARD_STATS: '/dashboard/stats',
    
    // POS
    POS_SALES: '/pos/sales',
    
    // Settings
    SETTINGS: '/settings',
    WAREHOUSES: '/warehouses',
  },
};

// Request/Response status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'Resource not found.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};
