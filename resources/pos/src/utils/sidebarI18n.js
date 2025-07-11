/**
 * Internationalization utilities for Sidebar Enhancements
 * Provides translation management and formatting for sidebar features
 */

import { useIntl } from 'react-intl';
import { useMemo } from 'react';

// Import translation files
import enTranslations from '../locales/sidebar/en.json';
import esTranslations from '../locales/sidebar/es.json';
import frTranslations from '../locales/sidebar/fr.json';

// Available languages
export const SUPPORTED_LANGUAGES = {
  en: { code: 'en', name: 'English', nativeName: 'English' },
  es: { code: 'es', name: 'Spanish', nativeName: 'Español' },
  fr: { code: 'fr', name: 'French', nativeName: 'Français' },
};

// Translation bundles
export const TRANSLATION_BUNDLES = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations,
};

/**
 * Get translations for a specific language
 */
export const getTranslations = (language = 'en') => {
  return TRANSLATION_BUNDLES[language] || TRANSLATION_BUNDLES.en;
};

/**
 * Merge sidebar translations with existing messages
 */
export const mergeSidebarTranslations = (existingMessages, language = 'en') => {
  const sidebarTranslations = getTranslations(language);
  return {
    ...existingMessages,
    ...sidebarTranslations,
  };
};

/**
 * Custom hook for sidebar translations
 */
export const useSidebarTranslations = () => {
  const intl = useIntl();

  const t = useMemo(() => {
    return (key, values = {}) => {
      try {
        return intl.formatMessage({ id: `sidebar.${key}` }, values);
      } catch (error) {
        console.warn(`Translation missing for key: sidebar.${key}`);
        return key;
      }
    };
  }, [intl]);

  const formatPlural = useMemo(() => {
    return (key, count, values = {}) => {
      try {
        return intl.formatMessage(
          { id: `sidebar.${key}` },
          { count, ...values }
        );
      } catch (error) {
        console.warn(`Plural translation missing for key: sidebar.${key}`);
        return `${count} ${key}`;
      }
    };
  }, [intl]);

  const formatDate = useMemo(() => {
    return (date, options = {}) => {
      return intl.formatDate(date, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        ...options,
      });
    };
  }, [intl]);

  const formatTime = useMemo(() => {
    return (date, options = {}) => {
      return intl.formatTime(date, {
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      });
    };
  }, [intl]);

  const formatNumber = useMemo(() => {
    return (number, options = {}) => {
      return intl.formatNumber(number, options);
    };
  }, [intl]);

  const formatDuration = useMemo(() => {
    return (milliseconds) => {
      const seconds = Math.floor(milliseconds / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);

      if (hours > 0) {
        return t('performance.duration.hours', { hours, minutes: minutes % 60 });
      } else if (minutes > 0) {
        return t('performance.duration.minutes', { minutes, seconds: seconds % 60 });
      } else {
        return t('performance.duration.seconds', { seconds });
      }
    };
  }, [t]);

  return {
    t,
    formatPlural,
    formatDate,
    formatTime,
    formatNumber,
    formatDuration,
    locale: intl.locale,
  };
};

/**
 * Translation keys for different sidebar features
 */
export const TRANSLATION_KEYS = {
  SEARCH: {
    PLACEHOLDER: 'search.placeholder',
    CLEAR: 'search.clear',
    NO_RESULTS: 'search.noResults',
    RESULTS_COUNT: 'search.resultsCount',
    FUZZY_SEARCH: 'search.fuzzySearch',
    RECENT_SEARCHES: 'search.recentSearches',
    CLEAR_HISTORY: 'search.clearHistory',
    SUGGESTIONS: 'search.suggestions',
  },
  THEME: {
    TOGGLE: 'theme.toggle',
    SWITCH_TO_LIGHT: 'theme.switchToLight',
    SWITCH_TO_DARK: 'theme.switchToDark',
    USE_SYSTEM: 'theme.useSystem',
    LIGHT: 'theme.light',
    DARK: 'theme.dark',
    SYSTEM: 'theme.system',
  },
  SETTINGS: {
    TITLE: 'settings.title',
    CLOSE: 'settings.close',
    WIDTH: 'settings.width',
    MENU_STYLE: 'settings.menuStyle',
    ANIMATION_SPEED: 'settings.animationSpeed',
    SHOW_ICONS: 'settings.showIcons',
    SHOW_NOTIFICATIONS: 'settings.showNotifications',
    COMPACT_MODE: 'settings.compactMode',
    AUTO_COLLAPSE: 'settings.autoCollapse',
    PERSIST_STATE: 'settings.persistState',
    RESET_TO_DEFAULTS: 'settings.resetToDefaults',
  },
  ANALYTICS: {
    TITLE: 'analytics.title',
    CLOSE: 'analytics.close',
    OVERVIEW: 'analytics.tabs.overview',
    MENU: 'analytics.tabs.menu',
    SEARCH: 'analytics.tabs.search',
    TOTAL_SESSIONS: 'analytics.overview.totalSessions',
    MENU_CLICKS: 'analytics.overview.menuClicks',
    SEARCHES: 'analytics.overview.searches',
    AVG_SESSION_TIME: 'analytics.overview.avgSessionTime',
    QUICK_ACCESS: 'analytics.overview.quickAccess',
    CLEAR_DATA: 'analytics.clearData',
    EXPORT_DATA: 'analytics.exportData',
  },
  NAVIGATION: {
    MAIN_NAVIGATION: 'navigation.mainNavigation',
    MENU_ITEM: 'navigation.menuItem',
    SUBMENU: 'navigation.submenu',
    EXPAND_SIDEBAR: 'navigation.expandSidebar',
    COLLAPSE_SIDEBAR: 'navigation.collapseSidebar',
    OPEN_MENU: 'navigation.openMenu',
    CLOSE_MENU: 'navigation.closeMenu',
  },
  ACCESSIBILITY: {
    SKIP_TO_CONTENT: 'accessibility.skipToContent',
    KEYBOARD_SHORTCUTS: 'accessibility.keyboardShortcuts',
    SEARCH_SHORTCUT: 'accessibility.searchShortcut',
    ESCAPE_SHORTCUT: 'accessibility.escapeShortcut',
    ARROW_NAVIGATION: 'accessibility.arrowNavigation',
    ENTER_TO_SELECT: 'accessibility.enterToSelect',
  },
  ERRORS: {
    LOAD_FAILED: 'errors.loadFailed',
    SEARCH_FAILED: 'errors.searchFailed',
    SETTINGS_SAVE_FAILED: 'errors.settingsSaveFailed',
    ANALYTICS_LOAD_FAILED: 'errors.analyticsLoadFailed',
    NETWORK_ERROR: 'errors.networkError',
    RETRY: 'errors.retry',
    DISMISS: 'errors.dismiss',
  },
  SUCCESS: {
    SETTINGS_SAVED: 'success.settingsSaved',
    DATA_CLEARED: 'success.dataCleared',
    THEME_CHANGED: 'success.themeChanged',
    SEARCH_COMPLETED: 'success.searchCompleted',
  },
};

/**
 * Validation helper for translation completeness
 */
export const validateTranslations = (language) => {
  const translations = getTranslations(language);
  const englishTranslations = getTranslations('en');
  
  const missingKeys = [];
  
  const checkKeys = (obj, refObj, path = '') => {
    for (const key in refObj) {
      const currentPath = path ? `${path}.${key}` : key;
      
      if (!(key in obj)) {
        missingKeys.push(currentPath);
      } else if (typeof refObj[key] === 'object' && refObj[key] !== null) {
        checkKeys(obj[key], refObj[key], currentPath);
      }
    }
  };
  
  checkKeys(translations, englishTranslations);
  
  return {
    isComplete: missingKeys.length === 0,
    missingKeys,
    completeness: ((Object.keys(englishTranslations).length - missingKeys.length) / Object.keys(englishTranslations).length) * 100,
  };
};

/**
 * RTL language support
 */
export const RTL_LANGUAGES = ['ar', 'he', 'fa'];

export const isRTLLanguage = (language) => {
  return RTL_LANGUAGES.includes(language);
};

/**
 * Language detection utilities
 */
export const detectUserLanguage = () => {
  // Check localStorage first
  const savedLanguage = localStorage.getItem('swiftsale-language');
  if (savedLanguage && SUPPORTED_LANGUAGES[savedLanguage]) {
    return savedLanguage;
  }
  
  // Check browser language
  const browserLanguage = navigator.language.split('-')[0];
  if (SUPPORTED_LANGUAGES[browserLanguage]) {
    return browserLanguage;
  }
  
  // Default to English
  return 'en';
};

/**
 * Export utilities for translation management
 */
export const exportTranslations = (language) => {
  const translations = getTranslations(language);
  const blob = new Blob([JSON.stringify(translations, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sidebar-translations-${language}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  useSidebarTranslations,
  getTranslations,
  mergeSidebarTranslations,
  TRANSLATION_KEYS,
  SUPPORTED_LANGUAGES,
  validateTranslations,
  isRTLLanguage,
  detectUserLanguage,
  exportTranslations,
};
