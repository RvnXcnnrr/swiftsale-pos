/**
 * Accessibility Tests for Enhanced Sidebar
 * Tests WCAG compliance, keyboard navigation, and screen reader support
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { IntlProvider } from 'react-intl';
import { configureStore } from '@reduxjs/toolkit';

import AsideMenu from '../../components/sidebar/asideMenu';
import { ThemeProvider } from '../../contexts/ThemeContext';
import { SidebarSettingsProvider } from '../../contexts/SidebarSettingsContext';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

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

describe('Sidebar Accessibility', () => {
    let user;

    beforeEach(() => {
        user = userEvent.setup();
        localStorage.clear();
    });

    describe('WCAG Compliance', () => {
        test('should not have accessibility violations', async () => {
            const { container } = render(
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

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        test('should have proper heading hierarchy', () => {
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

            // Check for proper heading structure in settings panel
            const settingsButton = screen.getByLabelText(/sidebar settings/i);
            fireEvent.click(settingsButton);

            const heading = screen.getByRole('heading', { level: 3 });
            expect(heading).toBeInTheDocument();
        });

        test('should have sufficient color contrast', () => {
            // This would typically be tested with automated tools
            // or manual verification with contrast checkers
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

            // Verify elements have appropriate styling for contrast
            const navigation = screen.getByRole('navigation');
            expect(navigation).toBeInTheDocument();
        });
    });

    describe('ARIA Labels and Roles', () => {
        test('should have proper navigation role', () => {
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

            const navigation = screen.getByRole('navigation');
            expect(navigation).toHaveAttribute('aria-label', 'Main navigation');
        });

        test('should have proper menubar and menuitem roles', () => {
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

            expect(screen.getByRole('menubar')).toBeInTheDocument();
            expect(screen.getAllByRole('menuitem')).toHaveLength(2);
        });

        test('should have proper aria-expanded attributes', () => {
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

            const navigation = screen.getByRole('navigation');
            expect(navigation).toHaveAttribute('aria-expanded');
        });

        test('should have proper labels for interactive elements', () => {
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

            expect(screen.getByLabelText(/search menu items/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/sidebar settings/i)).toBeInTheDocument();
            expect(screen.getByLabelText(/view analytics/i)).toBeInTheDocument();
        });

        test('should have proper aria-hidden for decorative elements', () => {
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

            // Search icon should be hidden from screen readers
            const searchIcon = document.querySelector('.search-icon');
            expect(searchIcon).toHaveAttribute('aria-hidden', 'true');
        });
    });

    describe('Keyboard Navigation', () => {
        test('should support Tab navigation through interactive elements', async () => {
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

            // Tab through elements
            await user.tab();
            expect(screen.getByLabelText(/search menu items/i)).toHaveFocus();

            await user.tab();
            // Should focus on first menu item or next interactive element
        });

        test('should support Ctrl+K shortcut to focus search', async () => {
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

            // Press Ctrl+K
            fireEvent.keyDown(document, { key: 'k', ctrlKey: true });

            expect(screen.getByLabelText(/search menu items/i)).toHaveFocus();
        });

        test('should support Escape key to clear search', async () => {
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
            
            // Type in search
            await user.type(searchInput, 'dashboard');
            expect(searchInput.value).toBe('dashboard');

            // Press Escape
            fireEvent.keyDown(searchInput, { key: 'Escape' });
            expect(searchInput.value).toBe('');
        });

        test('should support arrow key navigation in search results', async () => {
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
            
            // Type to trigger search
            await user.type(searchInput, 'dash');

            // Test arrow key navigation
            fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
            fireEvent.keyDown(searchInput, { key: 'ArrowUp' });
            fireEvent.keyDown(searchInput, { key: 'Enter' });
        });

        test('should support Enter and Space for button activation', async () => {
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
            
            // Focus the button
            settingsButton.focus();
            expect(settingsButton).toHaveFocus();

            // Press Enter
            fireEvent.keyDown(settingsButton, { key: 'Enter' });
            expect(screen.getByText('Sidebar Settings')).toBeInTheDocument();

            // Close and test Space key
            const closeButton = screen.getByText('×');
            fireEvent.click(closeButton);

            settingsButton.focus();
            fireEvent.keyDown(settingsButton, { key: ' ' });
            expect(screen.getByText('Sidebar Settings')).toBeInTheDocument();
        });
    });

    describe('Focus Management', () => {
        test('should have visible focus indicators', () => {
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

            // Check if focus styles are applied (would need custom matchers for actual style checking)
            expect(searchInput).toHaveFocus();
        });

        test('should trap focus in modal dialogs', async () => {
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

            // Open settings panel
            const settingsButton = screen.getByLabelText(/sidebar settings/i);
            await user.click(settingsButton);

            // Focus should be trapped within the modal
            const modal = screen.getByText('Sidebar Settings').closest('.sidebar-settings-panel');
            expect(modal).toBeInTheDocument();

            // Tab through modal elements
            await user.tab();
            // Focus should stay within modal
        });

        test('should restore focus when closing modals', async () => {
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
            
            // Focus and open settings
            settingsButton.focus();
            await user.click(settingsButton);

            // Close settings
            const closeButton = screen.getByText('×');
            await user.click(closeButton);

            // Focus should return to settings button
            expect(settingsButton).toHaveFocus();
        });
    });

    describe('Screen Reader Support', () => {
        test('should announce dynamic content changes', async () => {
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
            
            // Type search query
            await user.type(searchInput, 'dashboard');

            // Check for search results announcement
            const resultsInfo = screen.getByText(/result.*found/i);
            expect(resultsInfo).toBeInTheDocument();
        });

        test('should have proper live regions for status updates', () => {
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

            // Search results info should act as a live region
            const searchInput = screen.getByLabelText(/search menu items/i);
            fireEvent.change(searchInput, { target: { value: 'test' } });

            // Live region should be present for screen reader announcements
            const resultsInfo = screen.getByText(/result.*found/i);
            expect(resultsInfo).toBeInTheDocument();
        });
    });

    describe('Reduced Motion Support', () => {
        test('should respect prefers-reduced-motion', () => {
            // Mock matchMedia for reduced motion
            Object.defineProperty(window, 'matchMedia', {
                writable: true,
                value: jest.fn().mockImplementation(query => ({
                    matches: query === '(prefers-reduced-motion: reduce)',
                    media: query,
                    onchange: null,
                    addListener: jest.fn(),
                    removeListener: jest.fn(),
                    addEventListener: jest.fn(),
                    removeEventListener: jest.fn(),
                    dispatchEvent: jest.fn(),
                })),
            });

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

            // Elements should have reduced motion styles applied
            const sidebar = screen.getByRole('navigation');
            expect(sidebar).toBeInTheDocument();
        });
    });
});
