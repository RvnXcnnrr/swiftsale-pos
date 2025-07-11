/**
 * Test Setup Configuration
 * Global setup for all sidebar enhancement tests
 */

import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock performance API
Object.defineProperty(window, 'performance', {
  writable: true,
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    memory: {
      usedJSHeapSize: 1000000,
      totalJSHeapSize: 2000000,
      jsHeapSizeLimit: 4000000,
    },
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));

// Mock scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: jest.fn(),
}));

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();
  
  // Reset localStorage mock
  localStorageMock.getItem.mockReturnValue(null);
  localStorageMock.setItem.mockImplementation(() => {});
  localStorageMock.removeItem.mockImplementation(() => {});
  localStorageMock.clear.mockImplementation(() => {});
  
  // Reset sessionStorage mock
  sessionStorageMock.getItem.mockReturnValue(null);
  sessionStorageMock.setItem.mockImplementation(() => {});
  sessionStorageMock.removeItem.mockImplementation(() => {});
  sessionStorageMock.clear.mockImplementation(() => {});
  
  // Suppress console errors/warnings for cleaner test output
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  
  // Clean up any timers
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

// Global test utilities
global.testUtils = {
  // Wait for next tick
  waitForNextTick: () => new Promise(resolve => setTimeout(resolve, 0)),
  
  // Wait for specific time
  wait: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
  
  // Mock component props
  getMockProps: () => ({
    asideConfig: [
      {
        title: "dashboard.title",
        name: "dashboard",
        fontIcon: <span>📊</span>,
        to: "/app/dashboard",
        class: "d-flex",
        permission: "MANAGE_DASHBOARD",
      }
    ],
    frontSetting: {
      value: {
        logo: "/logo.png",
        company_name: "SwiftSale",
        show_app_name_in_sidebar: "1"
      }
    },
    isResponsiveMenu: false,
    menuClick: jest.fn(),
    menuIconClick: jest.fn(),
    isMenuCollapse: false,
  }),
  
  // Create mock store
  createMockStore: () => ({
    getState: jest.fn(() => ({
      updateLanguage: { selectedLanguage: 'en' },
      frontSetting: {
        value: {
          logo: "/logo.png",
          company_name: "SwiftSale",
          show_app_name_in_sidebar: "1"
        }
      }
    })),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
  }),
  
  // Mock React Intl messages
  getMockMessages: () => ({
    'dashboard.title': 'Dashboard',
    'products.title': 'Products',
    'categories.title': 'Categories',
    'react-data-table.searchbar.placeholder': 'Search...',
  }),
};

// Custom matchers
expect.extend({
  toHaveAccessibleName(received, expected) {
    const accessibleName = received.getAttribute('aria-label') || 
                          received.getAttribute('aria-labelledby') ||
                          received.textContent;
    
    const pass = accessibleName === expected;
    
    if (pass) {
      return {
        message: () => `expected element not to have accessible name "${expected}"`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected element to have accessible name "${expected}" but got "${accessibleName}"`,
        pass: false,
      };
    }
  },
  
  toBeVisuallyHidden(received) {
    const style = window.getComputedStyle(received);
    const isHidden = style.position === 'absolute' &&
                    style.width === '1px' &&
                    style.height === '1px' &&
                    style.padding === '0px' &&
                    style.margin === '-1px' &&
                    style.overflow === 'hidden' &&
                    style.clip === 'rect(0px, 0px, 0px, 0px)' &&
                    style.whiteSpace === 'nowrap' &&
                    style.border === '0px';
    
    if (isHidden) {
      return {
        message: () => 'expected element not to be visually hidden',
        pass: true,
      };
    } else {
      return {
        message: () => 'expected element to be visually hidden',
        pass: false,
      };
    }
  },
});

// Error boundary for tests
class TestErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Test Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div data-testid="error-boundary">Something went wrong.</div>;
    }

    return this.props.children;
  }
}

global.TestErrorBoundary = TestErrorBoundary;
