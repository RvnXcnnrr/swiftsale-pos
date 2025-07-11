/**
 * Sidebar Analytics System
 * Tracks menu usage, popular items, and user behavior patterns
 */

// Analytics Event Types
export const ANALYTICS_EVENTS = {
    MENU_ITEM_CLICK: 'menu_item_click',
    SEARCH_PERFORMED: 'search_performed',
    SIDEBAR_TOGGLE: 'sidebar_toggle',
    THEME_CHANGE: 'theme_change',
    SETTINGS_CHANGE: 'settings_change',
    SESSION_START: 'session_start',
    SESSION_END: 'session_end',
};

// Analytics Storage Keys
const STORAGE_KEYS = {
    MENU_USAGE: 'swiftsale-menu-usage',
    SEARCH_ANALYTICS: 'swiftsale-search-analytics',
    SESSION_DATA: 'swiftsale-session-data',
    USER_PREFERENCES: 'swiftsale-user-preferences',
};

/**
 * Menu Usage Tracker
 */
export class MenuUsageTracker {
    constructor() {
        this.usage = this.loadUsageData();
        this.session = this.initializeSession();
    }

    // Load usage data from localStorage
    loadUsageData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.MENU_USAGE);
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Error loading menu usage data:', error);
            return {};
        }
    }

    // Save usage data to localStorage
    saveUsageData() {
        try {
            localStorage.setItem(STORAGE_KEYS.MENU_USAGE, JSON.stringify(this.usage));
        } catch (error) {
            console.error('Error saving menu usage data:', error);
        }
    }

    // Initialize session
    initializeSession() {
        return {
            startTime: Date.now(),
            menuClicks: 0,
            searchQueries: 0,
            sidebarToggles: 0,
        };
    }

    // Track menu item click
    trackMenuClick(itemId, itemName, itemPath) {
        const timestamp = Date.now();
        
        if (!this.usage[itemId]) {
            this.usage[itemId] = {
                id: itemId,
                name: itemName,
                path: itemPath,
                clickCount: 0,
                lastClicked: null,
                firstClicked: timestamp,
                averageSessionClicks: 0,
                clicksByDay: {},
                clicksByHour: {},
            };
        }

        const usage = this.usage[itemId];
        usage.clickCount++;
        usage.lastClicked = timestamp;
        
        // Track by day
        const day = new Date(timestamp).toDateString();
        usage.clicksByDay[day] = (usage.clicksByDay[day] || 0) + 1;
        
        // Track by hour
        const hour = new Date(timestamp).getHours();
        usage.clicksByHour[hour] = (usage.clicksByHour[hour] || 0) + 1;

        this.session.menuClicks++;
        this.saveUsageData();
    }

    // Get most used menu items
    getMostUsedItems(limit = 10) {
        return Object.values(this.usage)
            .sort((a, b) => b.clickCount - a.clickCount)
            .slice(0, limit);
    }

    // Get recently used items
    getRecentlyUsedItems(limit = 5) {
        return Object.values(this.usage)
            .filter(item => item.lastClicked)
            .sort((a, b) => b.lastClicked - a.lastClicked)
            .slice(0, limit);
    }

    // Get usage statistics
    getUsageStats() {
        const items = Object.values(this.usage);
        const totalClicks = items.reduce((sum, item) => sum + item.clickCount, 0);
        
        return {
            totalMenuItems: items.length,
            totalClicks,
            averageClicksPerItem: totalClicks / items.length || 0,
            mostUsedItem: items.reduce((max, item) => 
                item.clickCount > (max?.clickCount || 0) ? item : max, null),
            sessionStats: this.session,
        };
    }

    // Get usage by time period
    getUsageByTimePeriod(period = 'day') {
        const usage = {};
        
        Object.values(this.usage).forEach(item => {
            const data = period === 'day' ? item.clicksByDay : item.clicksByHour;
            Object.entries(data).forEach(([key, count]) => {
                usage[key] = (usage[key] || 0) + count;
            });
        });
        
        return usage;
    }

    // Clear usage data
    clearUsageData() {
        this.usage = {};
        this.saveUsageData();
    }
}

/**
 * Search Analytics Tracker
 */
export class SearchAnalyticsTracker {
    constructor() {
        this.analytics = this.loadAnalytics();
    }

    // Load analytics data
    loadAnalytics() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SEARCH_ANALYTICS);
            return saved ? JSON.parse(saved) : {
                queries: {},
                totalSearches: 0,
                noResultsQueries: [],
                popularQueries: [],
            };
        } catch (error) {
            console.error('Error loading search analytics:', error);
            return { queries: {}, totalSearches: 0, noResultsQueries: [], popularQueries: [] };
        }
    }

    // Save analytics data
    saveAnalytics() {
        try {
            localStorage.setItem(STORAGE_KEYS.SEARCH_ANALYTICS, JSON.stringify(this.analytics));
        } catch (error) {
            console.error('Error saving search analytics:', error);
        }
    }

    // Track search query
    trackSearch(query, resultCount = 0) {
        if (!query.trim()) return;

        const normalizedQuery = query.toLowerCase().trim();
        
        if (!this.analytics.queries[normalizedQuery]) {
            this.analytics.queries[normalizedQuery] = {
                query: normalizedQuery,
                count: 0,
                lastSearched: null,
                averageResults: 0,
                totalResults: 0,
            };
        }

        const queryData = this.analytics.queries[normalizedQuery];
        queryData.count++;
        queryData.lastSearched = Date.now();
        queryData.totalResults += resultCount;
        queryData.averageResults = queryData.totalResults / queryData.count;

        this.analytics.totalSearches++;

        // Track no-results queries
        if (resultCount === 0) {
            if (!this.analytics.noResultsQueries.includes(normalizedQuery)) {
                this.analytics.noResultsQueries.push(normalizedQuery);
            }
        }

        this.updatePopularQueries();
        this.saveAnalytics();
    }

    // Update popular queries
    updatePopularQueries() {
        this.analytics.popularQueries = Object.values(this.analytics.queries)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(q => q.query);
    }

    // Get search statistics
    getSearchStats() {
        return {
            totalSearches: this.analytics.totalSearches,
            uniqueQueries: Object.keys(this.analytics.queries).length,
            popularQueries: this.analytics.popularQueries,
            noResultsQueries: this.analytics.noResultsQueries,
            averageResultsPerQuery: Object.values(this.analytics.queries)
                .reduce((sum, q) => sum + q.averageResults, 0) / 
                Object.keys(this.analytics.queries).length || 0,
        };
    }

    // Clear search analytics
    clearAnalytics() {
        this.analytics = { queries: {}, totalSearches: 0, noResultsQueries: [], popularQueries: [] };
        this.saveAnalytics();
    }
}

/**
 * User Behavior Analytics
 */
export class UserBehaviorAnalytics {
    constructor() {
        this.menuTracker = new MenuUsageTracker();
        this.searchTracker = new SearchAnalyticsTracker();
        this.sessionData = this.loadSessionData();
        this.startSession();
    }

    // Load session data
    loadSessionData() {
        try {
            const saved = localStorage.getItem(STORAGE_KEYS.SESSION_DATA);
            return saved ? JSON.parse(saved) : {
                totalSessions: 0,
                totalTimeSpent: 0,
                averageSessionTime: 0,
                lastSessionDate: null,
            };
        } catch (error) {
            console.error('Error loading session data:', error);
            return { totalSessions: 0, totalTimeSpent: 0, averageSessionTime: 0, lastSessionDate: null };
        }
    }

    // Save session data
    saveSessionData() {
        try {
            localStorage.setItem(STORAGE_KEYS.SESSION_DATA, JSON.stringify(this.sessionData));
        } catch (error) {
            console.error('Error saving session data:', error);
        }
    }

    // Start new session
    startSession() {
        this.currentSession = {
            startTime: Date.now(),
            endTime: null,
            menuClicks: 0,
            searchQueries: 0,
            sidebarToggles: 0,
        };

        this.sessionData.totalSessions++;
        this.sessionData.lastSessionDate = Date.now();
    }

    // End current session
    endSession() {
        if (this.currentSession) {
            this.currentSession.endTime = Date.now();
            const sessionTime = this.currentSession.endTime - this.currentSession.startTime;
            
            this.sessionData.totalTimeSpent += sessionTime;
            this.sessionData.averageSessionTime = this.sessionData.totalTimeSpent / this.sessionData.totalSessions;
            
            this.saveSessionData();
        }
    }

    // Track menu item click
    trackMenuClick(itemId, itemName, itemPath) {
        this.menuTracker.trackMenuClick(itemId, itemName, itemPath);
        if (this.currentSession) {
            this.currentSession.menuClicks++;
        }
    }

    // Track search
    trackSearch(query, resultCount) {
        this.searchTracker.trackSearch(query, resultCount);
        if (this.currentSession) {
            this.currentSession.searchQueries++;
        }
    }

    // Track sidebar toggle
    trackSidebarToggle() {
        if (this.currentSession) {
            this.currentSession.sidebarToggles++;
        }
    }

    // Get comprehensive analytics
    getAnalytics() {
        return {
            menu: this.menuTracker.getUsageStats(),
            search: this.searchTracker.getSearchStats(),
            session: this.sessionData,
            currentSession: this.currentSession,
            mostUsedItems: this.menuTracker.getMostUsedItems(5),
            recentItems: this.menuTracker.getRecentlyUsedItems(5),
        };
    }

    // Get recommendations based on usage
    getRecommendations() {
        const mostUsed = this.menuTracker.getMostUsedItems(3);
        const recent = this.menuTracker.getRecentlyUsedItems(3);
        const popular = this.searchTracker.analytics.popularQueries.slice(0, 3);

        return {
            quickAccess: mostUsed,
            continueWorking: recent,
            suggestedSearches: popular,
        };
    }

    // Export analytics data
    exportAnalytics() {
        return {
            timestamp: Date.now(),
            analytics: this.getAnalytics(),
            recommendations: this.getRecommendations(),
        };
    }

    // Clear all analytics
    clearAllAnalytics() {
        this.menuTracker.clearUsageData();
        this.searchTracker.clearAnalytics();
        this.sessionData = { totalSessions: 0, totalTimeSpent: 0, averageSessionTime: 0, lastSessionDate: null };
        this.saveSessionData();
    }
}

// Global analytics instance
let globalAnalytics = null;

// Initialize analytics
export const initializeAnalytics = () => {
    if (!globalAnalytics) {
        globalAnalytics = new UserBehaviorAnalytics();
        
        // Handle page unload
        window.addEventListener('beforeunload', () => {
            globalAnalytics.endSession();
        });
    }
    return globalAnalytics;
};

// Get analytics instance
export const getAnalytics = () => {
    return globalAnalytics || initializeAnalytics();
};

export default UserBehaviorAnalytics;

/**
 * Analytics Dashboard Component
 */
export const AnalyticsDashboard = ({ isOpen, onClose }) => {
    const [analytics, setAnalytics] = React.useState(null);
    const [activeTab, setActiveTab] = React.useState('overview');

    React.useEffect(() => {
        if (isOpen) {
            const data = getAnalytics().getAnalytics();
            setAnalytics(data);
        }
    }, [isOpen]);

    if (!isOpen || !analytics) return null;

    return (
        <div className="analytics-dashboard-overlay" onClick={onClose}>
            <div className="analytics-dashboard" onClick={e => e.stopPropagation()}>
                <div className="dashboard-header">
                    <h3>Sidebar Analytics</h3>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={activeTab === 'overview' ? 'active' : ''}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>
                    <button
                        className={activeTab === 'menu' ? 'active' : ''}
                        onClick={() => setActiveTab('menu')}
                    >
                        Menu Usage
                    </button>
                    <button
                        className={activeTab === 'search' ? 'active' : ''}
                        onClick={() => setActiveTab('search')}
                    >
                        Search Analytics
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h4>Total Sessions</h4>
                                    <span className="stat-value">{analytics.session.totalSessions}</span>
                                </div>
                                <div className="stat-card">
                                    <h4>Menu Clicks</h4>
                                    <span className="stat-value">{analytics.menu.totalClicks}</span>
                                </div>
                                <div className="stat-card">
                                    <h4>Searches</h4>
                                    <span className="stat-value">{analytics.search.totalSearches}</span>
                                </div>
                                <div className="stat-card">
                                    <h4>Avg Session Time</h4>
                                    <span className="stat-value">
                                        {Math.round(analytics.session.averageSessionTime / 60000)}m
                                    </span>
                                </div>
                            </div>

                            <div className="recommendations">
                                <h4>Quick Access</h4>
                                <div className="recommendation-list">
                                    {analytics.mostUsedItems.map((item, index) => (
                                        <div key={index} className="recommendation-item">
                                            <span>{item.name}</span>
                                            <span className="usage-count">{item.clickCount} clicks</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'menu' && (
                        <div className="menu-tab">
                            <h4>Most Used Menu Items</h4>
                            <div className="usage-list">
                                {analytics.mostUsedItems.map((item, index) => (
                                    <div key={index} className="usage-item">
                                        <div className="item-info">
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-path">{item.path}</span>
                                        </div>
                                        <div className="item-stats">
                                            <span className="click-count">{item.clickCount}</span>
                                            <div className="usage-bar">
                                                <div
                                                    className="usage-fill"
                                                    style={{
                                                        width: `${(item.clickCount / analytics.menu.totalClicks) * 100}%`
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'search' && (
                        <div className="search-tab">
                            <h4>Search Statistics</h4>
                            <div className="search-stats">
                                <p>Total Searches: {analytics.search.totalSearches}</p>
                                <p>Unique Queries: {analytics.search.uniqueQueries}</p>
                                <p>Avg Results: {analytics.search.averageResultsPerQuery.toFixed(1)}</p>
                            </div>

                            <h4>Popular Search Terms</h4>
                            <div className="popular-searches">
                                {analytics.search.popularQueries.map((query, index) => (
                                    <span key={index} className="search-tag">{query}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="dashboard-footer">
                    <button
                        onClick={() => {
                            getAnalytics().clearAllAnalytics();
                            setAnalytics(getAnalytics().getAnalytics());
                        }}
                        className="clear-data-btn"
                    >
                        Clear All Data
                    </button>
                </div>
            </div>
        </div>
    );
};
