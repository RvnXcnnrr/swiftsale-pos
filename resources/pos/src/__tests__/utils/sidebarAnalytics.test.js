/**
 * Unit Tests for Sidebar Analytics System
 */

import {
    MenuUsageTracker,
    SearchAnalyticsTracker,
    UserBehaviorAnalytics
} from '../../utils/sidebarAnalytics';

describe('MenuUsageTracker', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new MenuUsageTracker();
    });

    test('should track menu item clicks', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        const usage = tracker.usage['dashboard'];
        expect(usage.clickCount).toBe(1);
        expect(usage.name).toBe('Dashboard');
        expect(usage.path).toBe('/app/dashboard');
        expect(usage.lastClicked).toBeDefined();
        expect(usage.firstClicked).toBeDefined();
    });

    test('should increment click count for repeated clicks', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        expect(tracker.usage['dashboard'].clickCount).toBe(2);
    });

    test('should track clicks by day and hour', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        const usage = tracker.usage['dashboard'];
        const today = new Date().toDateString();
        const currentHour = new Date().getHours();
        
        expect(usage.clicksByDay[today]).toBe(1);
        expect(usage.clicksByHour[currentHour]).toBe(1);
    });

    test('should get most used items', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        tracker.trackMenuClick('products', 'Products', '/app/products');
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard'); // 2 clicks
        
        const mostUsed = tracker.getMostUsedItems(2);
        expect(mostUsed).toHaveLength(2);
        expect(mostUsed[0].name).toBe('Dashboard'); // Most clicked
        expect(mostUsed[1].name).toBe('Products');
    });

    test('should get recently used items', () => {
        tracker.trackMenuClick('products', 'Products', '/app/products');
        
        // Wait a bit to ensure different timestamps
        setTimeout(() => {
            tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
            
            const recent = tracker.getRecentlyUsedItems(2);
            expect(recent[0].name).toBe('Dashboard'); // Most recent
            expect(recent[1].name).toBe('Products');
        }, 10);
    });

    test('should provide usage statistics', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        tracker.trackMenuClick('products', 'Products', '/app/products');
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        const stats = tracker.getUsageStats();
        expect(stats.totalMenuItems).toBe(2);
        expect(stats.totalClicks).toBe(3);
        expect(stats.averageClicksPerItem).toBe(1.5);
        expect(stats.mostUsedItem.name).toBe('Dashboard');
    });

    test('should get usage by time period', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        const usageByDay = tracker.getUsageByTimePeriod('day');
        const usageByHour = tracker.getUsageByTimePeriod('hour');
        
        expect(Object.keys(usageByDay)).toHaveLength(1);
        expect(Object.keys(usageByHour)).toHaveLength(1);
    });

    test('should persist data to localStorage', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        // Create new instance to test persistence
        const newTracker = new MenuUsageTracker();
        expect(newTracker.usage['dashboard']).toBeDefined();
        expect(newTracker.usage['dashboard'].clickCount).toBe(1);
    });

    test('should clear usage data', () => {
        tracker.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        tracker.clearUsageData();
        
        expect(Object.keys(tracker.usage)).toHaveLength(0);
    });
});

describe('SearchAnalyticsTracker', () => {
    let tracker;

    beforeEach(() => {
        localStorage.clear();
        tracker = new SearchAnalyticsTracker();
    });

    test('should track search queries', () => {
        tracker.trackSearch('dashboard', 5);
        
        const query = tracker.analytics.queries['dashboard'];
        expect(query.count).toBe(1);
        expect(query.totalResults).toBe(5);
        expect(query.averageResults).toBe(5);
        expect(tracker.analytics.totalSearches).toBe(1);
    });

    test('should normalize query strings', () => {
        tracker.trackSearch('  Dashboard  ', 3);
        tracker.trackSearch('DASHBOARD', 2);
        
        const query = tracker.analytics.queries['dashboard'];
        expect(query.count).toBe(2);
        expect(query.totalResults).toBe(5);
        expect(query.averageResults).toBe(2.5);
    });

    test('should track no-results queries', () => {
        tracker.trackSearch('nonexistent', 0);
        
        expect(tracker.analytics.noResultsQueries).toContain('nonexistent');
    });

    test('should update popular queries', () => {
        tracker.trackSearch('dashboard', 5);
        tracker.trackSearch('products', 3);
        tracker.trackSearch('dashboard', 4); // Make dashboard more popular
        
        expect(tracker.analytics.popularQueries[0]).toBe('dashboard');
    });

    test('should provide search statistics', () => {
        tracker.trackSearch('dashboard', 5);
        tracker.trackSearch('products', 3);
        tracker.trackSearch('categories', 0); // No results
        
        const stats = tracker.getSearchStats();
        expect(stats.totalSearches).toBe(3);
        expect(stats.uniqueQueries).toBe(3);
        expect(stats.noResultsQueries).toContain('categories');
        expect(stats.popularQueries).toContain('dashboard');
    });

    test('should persist data to localStorage', () => {
        tracker.trackSearch('test', 1);
        
        const newTracker = new SearchAnalyticsTracker();
        expect(newTracker.analytics.queries['test']).toBeDefined();
    });

    test('should clear analytics data', () => {
        tracker.trackSearch('test', 1);
        tracker.clearAnalytics();
        
        expect(Object.keys(tracker.analytics.queries)).toHaveLength(0);
        expect(tracker.analytics.totalSearches).toBe(0);
    });
});

describe('UserBehaviorAnalytics', () => {
    let analytics;

    beforeEach(() => {
        localStorage.clear();
        analytics = new UserBehaviorAnalytics();
    });

    test('should initialize with session data', () => {
        expect(analytics.currentSession).toBeDefined();
        expect(analytics.currentSession.startTime).toBeDefined();
        expect(analytics.sessionData.totalSessions).toBe(1);
    });

    test('should track menu clicks', () => {
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        expect(analytics.currentSession.menuClicks).toBe(1);
        
        const menuStats = analytics.menuTracker.getUsageStats();
        expect(menuStats.totalClicks).toBe(1);
    });

    test('should track searches', () => {
        analytics.trackSearch('dashboard', 5);
        
        expect(analytics.currentSession.searchQueries).toBe(1);
        
        const searchStats = analytics.searchTracker.getSearchStats();
        expect(searchStats.totalSearches).toBe(1);
    });

    test('should track sidebar toggles', () => {
        analytics.trackSidebarToggle();
        
        expect(analytics.currentSession.sidebarToggles).toBe(1);
    });

    test('should end session and calculate time', () => {
        const startTime = analytics.currentSession.startTime;
        
        // Wait a bit to ensure session time > 0
        setTimeout(() => {
            analytics.endSession();
            
            expect(analytics.currentSession.endTime).toBeGreaterThan(startTime);
            expect(analytics.sessionData.totalTimeSpent).toBeGreaterThan(0);
        }, 10);
    });

    test('should provide comprehensive analytics', () => {
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        analytics.trackSearch('products', 3);
        
        const allAnalytics = analytics.getAnalytics();
        
        expect(allAnalytics.menu).toBeDefined();
        expect(allAnalytics.search).toBeDefined();
        expect(allAnalytics.session).toBeDefined();
        expect(allAnalytics.currentSession).toBeDefined();
        expect(allAnalytics.mostUsedItems).toBeDefined();
        expect(allAnalytics.recentItems).toBeDefined();
    });

    test('should provide recommendations', () => {
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        analytics.trackMenuClick('products', 'Products', '/app/products');
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        analytics.trackSearch('dashboard', 5);
        
        const recommendations = analytics.getRecommendations();
        
        expect(recommendations.quickAccess).toBeDefined();
        expect(recommendations.continueWorking).toBeDefined();
        expect(recommendations.suggestedSearches).toBeDefined();
        
        expect(recommendations.quickAccess[0].name).toBe('Dashboard');
        expect(recommendations.suggestedSearches).toContain('dashboard');
    });

    test('should export analytics data', () => {
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        
        const exported = analytics.exportAnalytics();
        
        expect(exported.timestamp).toBeDefined();
        expect(exported.analytics).toBeDefined();
        expect(exported.recommendations).toBeDefined();
    });

    test('should clear all analytics', () => {
        analytics.trackMenuClick('dashboard', 'Dashboard', '/app/dashboard');
        analytics.trackSearch('products', 3);
        
        analytics.clearAllAnalytics();
        
        const allAnalytics = analytics.getAnalytics();
        expect(allAnalytics.menu.totalClicks).toBe(0);
        expect(allAnalytics.search.totalSearches).toBe(0);
        expect(allAnalytics.session.totalSessions).toBe(0);
    });

    test('should handle localStorage errors gracefully', () => {
        // Mock localStorage to throw error
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = jest.fn(() => {
            throw new Error('Storage quota exceeded');
        });

        // Should not throw error
        expect(() => {
            analytics.trackMenuClick('test', 'Test', '/test');
        }).not.toThrow();

        // Restore original localStorage
        localStorage.setItem = originalSetItem;
    });
});
