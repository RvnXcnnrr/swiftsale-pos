/**
 * Comprehensive Test Suite for Sidebar Enhancements
 * Tests all new features including theme switching, search, analytics, and accessibility
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { configureStore } from '@reduxjs/toolkit';

// Import components to test
import AsideMenu from '../../components/sidebar/asideMenu';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { SidebarSettingsProvider } from '../../contexts/SidebarSettingsContext';
import { AdvancedSearchManager } from '../../utils/advancedSearch';
import { UserBehaviorAnalytics } from '../../utils/sidebarAnalytics';

// Mock data
const mockAsideConfig = [
    {
        title: "dashboard.title",
        name: "dashboard",
        fontIcon: <span>📊</span>,
        to: "/app/dashboard",
        class: "d-flex",
        permission: "MANAGE_DASHBOARD",
    },
    {
        title: "products.title",
        name: "products",
        fontIcon: <span>📦</span>,
        to: "/app/products",
        class: "d-flex",
        is_submenu: "true",
        permission: "MANAGE_PRODUCTS",
        newRoute: [
            {
                title: "products.title",
                name: "products",
                fontIcon: <span>📦</span>,
                to: "/app/products",
                class: "d-flex",
                permission: "MANAGE_PRODUCTS",
            },
            {
                title: "categories.title",
                name: "categories",
                fontIcon: <span>📂</span>,
                to: "/app/product-categories",
                class: "d-flex",
                permission: "MANAGE_CATEGORIES",
            }
        ]
    }
];

const mockFrontSetting = {
    value: {
        logo: "/logo.png",
        company_name: "SwiftSale",
        show_app_name_in_sidebar: "1"
    }
};

// Mock store
const createMockStore = () => configureStore({
    reducer: {
        updateLanguage: (state = { selectedLanguage: 'en' }) => state,
        frontSetting: (state = mockFrontSetting) => state,
    }
});

// Test wrapper component
const TestWrapper = ({ children }) => (
    <Provider store={createMockStore()}>
        <BrowserRouter>
            <IntlProvider locale="en" messages={{}}>
                <ThemeProvider>
                    <SidebarSettingsProvider>
                        {children}
                    </SidebarSettingsProvider>
                </ThemeProvider>
            </IntlProvider>
        </BrowserRouter>
    </Provider>
);

describe('Sidebar Enhancements', () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        // Clear localStorage before each test
        localStorage.clear();
        // Mock console methods to avoid noise in tests
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('Theme Switching', () => {
        test('should toggle between light and dark themes', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            // Find theme toggle button
            const themeToggle = screen.getByLabelText(/switch to dark mode/i);
            expect(themeToggle).toBeInTheDocument();

            // Click to switch to dark mode
            await user.click(themeToggle);

            // Check if dark theme class is applied
            await waitFor(() => {
                expect(document.documentElement).toHaveClass('dark-theme');
            });

            // Click again to switch back to light mode
            await user.click(themeToggle);

            await waitFor(() => {
                expect(document.documentElement).toHaveClass('light-theme');
            });
        });

        test('should persist theme preference in localStorage', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const themeToggle = screen.getByLabelText(/switch to dark mode/i);
            await user.click(themeToggle);

            await waitFor(() => {
                expect(localStorage.getItem('swiftsale-theme')).toBe('dark');
            });
        });
    });

    describe('Advanced Search', () => {
        test('should perform fuzzy search on menu items', async () => {
            const searchManager = new AdvancedSearchManager({
                threshold: 0.3,
                keys: ['title', 'name']
            });

            const items = [
                { title: 'Dashboard', name: 'dashboard' },
                { title: 'Products', name: 'products' },
                { title: 'Categories', name: 'categories' }
            ];

            // Test exact match
            let results = searchManager.fuzzySearch.search('dashboard', items);
            expect(results).toHaveLength(1);
            expect(results[0].name).toBe('dashboard');

            // Test fuzzy match with typo
            results = searchManager.fuzzySearch.search('dashbord', items);
            expect(results.length).toBeGreaterThan(0);

            // Test partial match
            results = searchManager.fuzzySearch.search('prod', items);
            expect(results.some(item => item.name === 'products')).toBe(true);
        });

        test('should save and retrieve search history', async () => {
            const searchManager = new AdvancedSearchManager();

            // Add searches to history
            searchManager.handleSearchSubmit('dashboard');
            searchManager.handleSearchSubmit('products');
            searchManager.handleSearchSubmit('sales');

            const history = searchManager.getHistory();
            expect(history).toContain('dashboard');
            expect(history).toContain('products');
            expect(history).toContain('sales');

            // Test suggestions
            const suggestions = searchManager.getSearchSuggestions('dash');
            expect(suggestions).toContain('dashboard');
        });

        test('should handle keyboard navigation in search results', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const searchInput = screen.getByLabelText(/search menu items/i);
            
            // Focus search input
            await user.click(searchInput);
            
            // Type search query
            await user.type(searchInput, 'dash');

            // Test keyboard navigation
            fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
            fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
            fireEvent.keyDown(searchInput, { key: 'Enter' });
            fireEvent.keyDown(searchInput, { key: 'Escape' });

            // Verify search input is cleared on escape
            expect(searchInput.value).toBe('');
        });
    });

    describe('Sidebar Settings', () => {
        test('should open and close settings panel', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            // Find settings button
            const settingsButton = screen.getByLabelText(/sidebar settings/i);
            await user.click(settingsButton);

            // Check if settings panel is open
            expect(screen.getByText('Sidebar Settings')).toBeInTheDocument();

            // Close settings panel
            const closeButton = screen.getByText('×');
            await user.click(closeButton);

            // Check if settings panel is closed
            await waitFor(() => {
                expect(screen.queryByText('Sidebar Settings')).not.toBeInTheDocument();
            });
        });

        test('should save settings to localStorage', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const settingsButton = screen.getByLabelText(/sidebar settings/i);
            await user.click(settingsButton);

            // Change a setting
            const compactModeCheckbox = screen.getByLabelText(/compact mode/i);
            await user.click(compactModeCheckbox);

            // Check if setting is saved
            await waitFor(() => {
                const savedSettings = JSON.parse(localStorage.getItem('swiftsale-sidebar-settings'));
                expect(savedSettings.compactMode).toBe(true);
            });
        });
    });

    describe('Analytics Tracking', () => {
        test('should track menu item clicks', () => {
            const analytics = new UserBehaviorAnalytics();
            
            // Track a menu click
            analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
            
            const stats = analytics.getAnalytics();
            expect(stats.menu.totalClicks).toBe(1);
            expect(stats.mostUsedItems[0].name).toBe('Dashboard');
        });

        test('should track search queries', () => {
            const analytics = new UserBehaviorAnalytics();
            
            // Track searches
            analytics.trackSearch('dashboard', 5);
            analytics.trackSearch('products', 3);
            analytics.trackSearch('dashboard', 5); // Duplicate to test counting
            
            const stats = analytics.getAnalytics();
            expect(stats.search.totalSearches).toBe(3);
            expect(stats.search.uniqueQueries).toBe(2);
        });

        test('should provide usage recommendations', () => {
            const analytics = new UserBehaviorAnalytics();
            
            // Add some usage data
            analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
            analytics.trackMenuClick('products', 'Products', '/app/products');
            analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
            
            const recommendations = analytics.getRecommendations();
            expect(recommendations.quickAccess).toHaveLength(2);
            expect(recommendations.quickAccess[0].name).toBe('Dashboard'); // Most used
        });
    });

    describe('Accessibility', () => {
        test('should have proper ARIA labels', () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            // Check for navigation role
            expect(screen.getByRole('navigation')).toBeInTheDocument();
            
            // Check for menu items
            expect(screen.getByRole('menubar')).toBeInTheDocument();
            
            // Check for search input accessibility
            expect(screen.getByLabelText(/search menu items/i)).toBeInTheDocument();
        });

        test('should support keyboard navigation', async () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            // Test Ctrl+K shortcut to focus search
            fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
            
            await waitFor(() => {
                expect(document.activeElement).toBe(screen.getByLabelText(/search menu items/i));
            });
        });

        test('should have proper focus indicators', () => {
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const searchInput = screen.getByLabelText(/search menu items/i);
            searchInput.focus();
            
            // Check if focus styles are applied (this would need custom matchers in a real test)
            expect(searchInput).toHaveFocus();
        });
    });

    describe('Performance', () => {
        test('should handle large menu lists efficiently', () => {
            // Create a large menu config
            const largeMenuConfig = Array.from({ length: 1000 }, (_, i) => ({
                title: `item-${i}`,
                name: `item-${i}`,
                fontIcon: <span>📄</span>,
                to: `/app/item-${i}`,
                class: "d-flex",
                permission: "MANAGE_ITEM",
            }));

            const startTime = performance.now();
            
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={largeMenuConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={false}
                        menuClick={jest.fn()}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            // Ensure rendering completes within reasonable time (adjust threshold as needed)
            expect(renderTime).toBeLessThan(1000); // 1 second
        });
    });

    describe('Mobile Responsiveness', () => {
        test('should handle touch gestures', () => {
            const mockMenuClick = jest.fn();
            
            render(
                <TestWrapper>
                    <AsideMenu
                        asideConfig={mockAsideConfig}
                        frontSetting={mockFrontSetting}
                        isResponsiveMenu={true}
                        menuClick={mockMenuClick}
                        menuIconClick={jest.fn()}
                        isMenuCollapse={false}
                    />
                </TestWrapper>
            );

            const sidebar = screen.getByRole('navigation');
            
            // Simulate swipe gesture
            fireEvent.touchStart(sidebar, {
                targetTouches: [{ clientX: 100 }]
            });
            
            fireEvent.touchMove(sidebar, {
                targetTouches: [{ clientX: 50 }]
            });
            
            fireEvent.touchEnd(sidebar);
            
            // Verify menu click was called (swipe left to close)
            expect(mockMenuClick).toHaveBeenCalled();
        });
    });
});
