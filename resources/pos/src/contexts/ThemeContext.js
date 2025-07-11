import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext();

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isSystemTheme, setIsSystemTheme] = useState(true);

    // Check for saved theme preference or default to system preference
    useEffect(() => {
        const savedTheme = localStorage.getItem('swiftsale-theme');
        const savedSystemTheme = localStorage.getItem('swiftsale-system-theme');
        
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
            setIsSystemTheme(savedSystemTheme === 'true');
        } else {
            // Check system preference
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(systemPrefersDark);
        }
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        if (isSystemTheme) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e) => setIsDarkMode(e.matches);
            
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [isSystemTheme]);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        
        if (isDarkMode) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        } else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
        
        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', isDarkMode ? '#1a1a1a' : '#ffffff');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        const newTheme = !isDarkMode;
        setIsDarkMode(newTheme);
        setIsSystemTheme(false);
        
        localStorage.setItem('swiftsale-theme', newTheme ? 'dark' : 'light');
        localStorage.setItem('swiftsale-system-theme', 'false');
    };

    const setSystemTheme = () => {
        setIsSystemTheme(true);
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(systemPrefersDark);
        
        localStorage.removeItem('swiftsale-theme');
        localStorage.setItem('swiftsale-system-theme', 'true');
    };

    const value = {
        isDarkMode,
        isSystemTheme,
        toggleTheme,
        setSystemTheme,
        theme: isDarkMode ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook to use theme
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme toggle component
export const ThemeToggle = ({ className = '' }) => {
    const { isDarkMode, isSystemTheme, toggleTheme, setSystemTheme } = useTheme();

    return (
        <div className={`theme-toggle ${className}`}>
            <button
                onClick={toggleTheme}
                className="theme-toggle-btn"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
                <span className="theme-icon">
                    {isDarkMode ? '☀️' : '🌙'}
                </span>
                <span className="theme-text">
                    {isDarkMode ? 'Light' : 'Dark'}
                </span>
            </button>

            {!isSystemTheme && (
                <button
                    onClick={setSystemTheme}
                    className="system-theme-btn"
                    aria-label="Use system theme"
                    title="Use system theme"
                >
                    🖥️
                </button>
            )}
        </div>
    );
};

export default ThemeContext;
