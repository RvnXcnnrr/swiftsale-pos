import React, { createContext, useContext, useState, useEffect } from 'react';

// Sidebar Settings Context
const SidebarSettingsContext = createContext();

// Default settings
const defaultSettings = {
    width: 270, // Default sidebar width
    autoCollapse: false, // Auto-collapse on mobile
    showIcons: true, // Show menu icons
    showNotifications: true, // Show notification badges
    compactMode: false, // Compact menu items
    sidebarPosition: 'left', // left or right
    menuStyle: 'modern', // modern, classic, minimal
    animationSpeed: 'normal', // slow, normal, fast
    persistState: true, // Remember collapsed state
    favoriteItems: [], // User's favorite menu items
    recentItems: [], // Recently accessed items
    customOrder: null, // Custom menu order
};

// Sidebar Settings Provider
export const SidebarSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [isLoading, setIsLoading] = useState(true);

    // Load settings from localStorage on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('swiftsale-sidebar-settings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings({ ...defaultSettings, ...parsed });
            } catch (error) {
                console.error('Error parsing sidebar settings:', error);
            }
        }
        setIsLoading(false);
    }, []);

    // Save settings to localStorage whenever they change
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('swiftsale-sidebar-settings', JSON.stringify(settings));
        }
    }, [settings, isLoading]);

    // Update a specific setting
    const updateSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Update multiple settings at once
    const updateSettings = (newSettings) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    // Reset to default settings
    const resetSettings = () => {
        setSettings(defaultSettings);
        localStorage.removeItem('swiftsale-sidebar-settings');
    };

    // Add item to favorites
    const addToFavorites = (itemId) => {
        setSettings(prev => ({
            ...prev,
            favoriteItems: [...new Set([...prev.favoriteItems, itemId])]
        }));
    };

    // Remove item from favorites
    const removeFromFavorites = (itemId) => {
        setSettings(prev => ({
            ...prev,
            favoriteItems: prev.favoriteItems.filter(id => id !== itemId)
        }));
    };

    // Add item to recent items (max 10)
    const addToRecent = (itemId) => {
        setSettings(prev => {
            const filtered = prev.recentItems.filter(id => id !== itemId);
            return {
                ...prev,
                recentItems: [itemId, ...filtered].slice(0, 10)
            };
        });
    };

    // Get animation class based on speed setting
    const getAnimationClass = () => {
        switch (settings.animationSpeed) {
            case 'slow': return 'sidebar-animation-slow';
            case 'fast': return 'sidebar-animation-fast';
            default: return 'sidebar-animation-normal';
        }
    };

    // Get sidebar CSS variables
    const getSidebarCSSVars = () => ({
        '--sidebar-width': `${settings.width}px`,
        '--sidebar-animation-speed': settings.animationSpeed === 'slow' ? '0.5s' : 
                                   settings.animationSpeed === 'fast' ? '0.15s' : '0.3s',
    });

    const value = {
        settings,
        isLoading,
        updateSetting,
        updateSettings,
        resetSettings,
        addToFavorites,
        removeFromFavorites,
        addToRecent,
        getAnimationClass,
        getSidebarCSSVars,
    };

    return (
        <SidebarSettingsContext.Provider value={value}>
            {children}
        </SidebarSettingsContext.Provider>
    );
};

// Custom hook to use sidebar settings
export const useSidebarSettings = () => {
    const context = useContext(SidebarSettingsContext);
    if (!context) {
        throw new Error('useSidebarSettings must be used within a SidebarSettingsProvider');
    }
    return context;
};

// Sidebar Settings Panel Component
export const SidebarSettingsPanel = ({ isOpen, onClose }) => {
    const {
        settings,
        updateSetting,
        resetSettings,
        getAnimationClass
    } = useSidebarSettings();

    if (!isOpen) return null;

    return (
        <div className="sidebar-settings-overlay" onClick={onClose}>
            <div className="sidebar-settings-panel" onClick={e => e.stopPropagation()}>
                <div className="settings-header">
                    <h3>Sidebar Settings</h3>
                    <button onClick={onClose} className="close-btn" aria-label="Close settings">×</button>
                </div>
                
                <div className="settings-content">
                    {/* Width Setting */}
                    <div className="setting-group">
                        <label>Sidebar Width</label>
                        <input
                            type="range"
                            min="200"
                            max="400"
                            value={settings.width}
                            onChange={(e) => updateSetting('width', parseInt(e.target.value))}
                        />
                        <span>{settings.width}px</span>
                    </div>

                    {/* Menu Style */}
                    <div className="setting-group">
                        <label>Menu Style</label>
                        <select
                            value={settings.menuStyle}
                            onChange={(e) => updateSetting('menuStyle', e.target.value)}
                        >
                            <option value="modern">Modern</option>
                            <option value="classic">Classic</option>
                            <option value="minimal">Minimal</option>
                        </select>
                    </div>

                    {/* Animation Speed */}
                    <div className="setting-group">
                        <label>Animation Speed</label>
                        <select
                            value={settings.animationSpeed}
                            onChange={(e) => updateSetting('animationSpeed', e.target.value)}
                        >
                            <option value="slow">Slow</option>
                            <option value="normal">Normal</option>
                            <option value="fast">Fast</option>
                        </select>
                    </div>

                    {/* Toggle Settings */}
                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.showIcons}
                                onChange={(e) => updateSetting('showIcons', e.target.checked)}
                            />
                            Show Menu Icons
                        </label>
                    </div>

                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.showNotifications}
                                onChange={(e) => updateSetting('showNotifications', e.target.checked)}
                            />
                            Show Notification Badges
                        </label>
                    </div>

                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.compactMode}
                                onChange={(e) => updateSetting('compactMode', e.target.checked)}
                            />
                            Compact Mode
                        </label>
                    </div>

                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.autoCollapse}
                                onChange={(e) => updateSetting('autoCollapse', e.target.checked)}
                            />
                            Auto-collapse on Mobile
                        </label>
                    </div>

                    <div className="setting-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={settings.persistState}
                                onChange={(e) => updateSetting('persistState', e.target.checked)}
                            />
                            Remember Collapsed State
                        </label>
                    </div>
                </div>

                <div className="settings-footer">
                    <button onClick={resetSettings} className="reset-btn">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SidebarSettingsContext;
