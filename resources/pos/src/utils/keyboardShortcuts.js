/**
 * Advanced Keyboard Shortcuts for Enhanced Sidebar
 * Provides comprehensive keyboard navigation and power user features
 */

import { useEffect, useCallback, useRef } from 'react';

// Keyboard shortcut definitions
export const KEYBOARD_SHORTCUTS = {
  // Navigation shortcuts
  FOCUS_SEARCH: { key: 'k', modifiers: ['ctrl'], description: 'Focus search input' },
  TOGGLE_SIDEBAR: { key: 'b', modifiers: ['ctrl'], description: 'Toggle sidebar' },
  ESCAPE: { key: 'Escape', modifiers: [], description: 'Close modals/clear search' },
  
  // Menu navigation
  ARROW_UP: { key: 'ArrowUp', modifiers: [], description: 'Navigate up in menu' },
  ARROW_DOWN: { key: 'ArrowDown', modifiers: [], description: 'Navigate down in menu' },
  ENTER: { key: 'Enter', modifiers: [], description: 'Select menu item' },
  SPACE: { key: ' ', modifiers: [], description: 'Activate button/checkbox' },
  
  // Quick access
  OPEN_SETTINGS: { key: 's', modifiers: ['ctrl', 'shift'], description: 'Open sidebar settings' },
  OPEN_ANALYTICS: { key: 'a', modifiers: ['ctrl', 'shift'], description: 'Open analytics dashboard' },
  TOGGLE_THEME: { key: 't', modifiers: ['ctrl'], description: 'Toggle dark/light theme' },
  
  // Advanced features
  CLEAR_SEARCH_HISTORY: { key: 'Delete', modifiers: ['ctrl', 'shift'], description: 'Clear search history' },
  EXPORT_ANALYTICS: { key: 'e', modifiers: ['ctrl', 'shift'], description: 'Export analytics data' },
  RESET_SETTINGS: { key: 'r', modifiers: ['ctrl', 'shift'], description: 'Reset sidebar settings' },
  
  // Accessibility
  SKIP_TO_CONTENT: { key: 'Tab', modifiers: [], description: 'Skip to main content' },
  SHOW_SHORTCUTS: { key: '?', modifiers: ['shift'], description: 'Show keyboard shortcuts help' },
};

// Modifier key mappings
const MODIFIER_KEYS = {
  ctrl: 'ctrlKey',
  shift: 'shiftKey',
  alt: 'altKey',
  meta: 'metaKey',
};

/**
 * Check if a keyboard event matches a shortcut definition
 */
export const matchesShortcut = (event, shortcut) => {
  // Check if the key matches
  if (event.key !== shortcut.key) {
    return false;
  }
  
  // Check if all required modifiers are pressed
  for (const modifier of shortcut.modifiers) {
    const modifierKey = MODIFIER_KEYS[modifier];
    if (!event[modifierKey]) {
      return false;
    }
  }
  
  // Check if any extra modifiers are pressed
  const requiredModifiers = shortcut.modifiers.map(m => MODIFIER_KEYS[m]);
  const pressedModifiers = Object.values(MODIFIER_KEYS).filter(key => event[key]);
  
  return pressedModifiers.length === requiredModifiers.length;
};

/**
 * Format shortcut for display
 */
export const formatShortcut = (shortcut) => {
  const modifiers = shortcut.modifiers.map(modifier => {
    switch (modifier) {
      case 'ctrl': return navigator.platform.includes('Mac') ? '⌘' : 'Ctrl';
      case 'shift': return '⇧';
      case 'alt': return navigator.platform.includes('Mac') ? '⌥' : 'Alt';
      case 'meta': return '⌘';
      default: return modifier;
    }
  });
  
  const key = shortcut.key === ' ' ? 'Space' : shortcut.key;
  
  return [...modifiers, key].join(navigator.platform.includes('Mac') ? '' : '+');
};

/**
 * Keyboard shortcut manager hook
 */
export const useKeyboardShortcuts = (shortcuts = {}, options = {}) => {
  const {
    enabled = true,
    preventDefault = true,
    stopPropagation = false,
    target = document,
  } = options;
  
  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;
  
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    // Skip if user is typing in an input field (unless explicitly allowed)
    const activeElement = document.activeElement;
    const isInputField = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.contentEditable === 'true'
    );
    
    // Allow certain shortcuts even in input fields
    const allowInInputs = [
      KEYBOARD_SHORTCUTS.ESCAPE,
      KEYBOARD_SHORTCUTS.FOCUS_SEARCH,
      KEYBOARD_SHORTCUTS.TOGGLE_SIDEBAR,
    ];
    
    if (isInputField && !allowInInputs.some(shortcut => matchesShortcut(event, shortcut))) {
      return;
    }
    
    // Check each registered shortcut
    for (const [name, handler] of Object.entries(shortcutsRef.current)) {
      const shortcut = KEYBOARD_SHORTCUTS[name];
      if (shortcut && matchesShortcut(event, shortcut)) {
        if (preventDefault) {
          event.preventDefault();
        }
        if (stopPropagation) {
          event.stopPropagation();
        }
        
        // Call the handler
        if (typeof handler === 'function') {
          handler(event);
        }
        
        break;
      }
    }
  }, [enabled, preventDefault, stopPropagation]);
  
  useEffect(() => {
    if (enabled) {
      target.addEventListener('keydown', handleKeyDown);
      return () => {
        target.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [enabled, handleKeyDown, target]);
  
  return {
    formatShortcut,
    matchesShortcut,
  };
};

/**
 * Sidebar-specific keyboard shortcuts hook
 */
export const useSidebarKeyboardShortcuts = ({
  onFocusSearch,
  onToggleSidebar,
  onOpenSettings,
  onOpenAnalytics,
  onToggleTheme,
  onClearSearchHistory,
  onExportAnalytics,
  onResetSettings,
  onShowShortcuts,
  onEscape,
}) => {
  const shortcuts = {
    FOCUS_SEARCH: onFocusSearch,
    TOGGLE_SIDEBAR: onToggleSidebar,
    OPEN_SETTINGS: onOpenSettings,
    OPEN_ANALYTICS: onOpenAnalytics,
    TOGGLE_THEME: onToggleTheme,
    CLEAR_SEARCH_HISTORY: onClearSearchHistory,
    EXPORT_ANALYTICS: onExportAnalytics,
    RESET_SETTINGS: onResetSettings,
    SHOW_SHORTCUTS: onShowShortcuts,
    ESCAPE: onEscape,
  };
  
  return useKeyboardShortcuts(shortcuts);
};

/**
 * Keyboard shortcuts help component
 */
export const KeyboardShortcutsHelp = ({ isOpen, onClose }) => {
  const { formatShortcut } = useKeyboardShortcuts();
  
  useEffect(() => {
    if (isOpen) {
      const handleEscape = (event) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const shortcutCategories = {
    'Navigation': [
      'FOCUS_SEARCH',
      'TOGGLE_SIDEBAR',
      'ESCAPE',
    ],
    'Menu Navigation': [
      'ARROW_UP',
      'ARROW_DOWN',
      'ENTER',
      'SPACE',
    ],
    'Quick Access': [
      'OPEN_SETTINGS',
      'OPEN_ANALYTICS',
      'TOGGLE_THEME',
    ],
    'Advanced': [
      'CLEAR_SEARCH_HISTORY',
      'EXPORT_ANALYTICS',
      'RESET_SETTINGS',
    ],
  };
  
  return (
    <div className="keyboard-shortcuts-overlay" onClick={onClose}>
      <div className="keyboard-shortcuts-panel" onClick={e => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h3>Keyboard Shortcuts</h3>
          <button onClick={onClose} className="close-btn" aria-label="Close shortcuts help">
            ×
          </button>
        </div>
        
        <div className="shortcuts-content">
          {Object.entries(shortcutCategories).map(([category, shortcutNames]) => (
            <div key={category} className="shortcut-category">
              <h4>{category}</h4>
              <div className="shortcut-list">
                {shortcutNames.map(name => {
                  const shortcut = KEYBOARD_SHORTCUTS[name];
                  return (
                    <div key={name} className="shortcut-item">
                      <span className="shortcut-keys">
                        {formatShortcut(shortcut)}
                      </span>
                      <span className="shortcut-description">
                        {shortcut.description}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="shortcuts-footer">
          <p>Press <kbd>Shift</kbd> + <kbd>?</kbd> to show this help again</p>
        </div>
      </div>
    </div>
  );
};

/**
 * Accessibility announcements for keyboard navigation
 */
export const useKeyboardAnnouncements = () => {
  const announceRef = useRef(null);
  
  const announce = useCallback((message, priority = 'polite') => {
    if (!announceRef.current) {
      // Create announcement element if it doesn't exist
      announceRef.current = document.createElement('div');
      announceRef.current.setAttribute('aria-live', priority);
      announceRef.current.setAttribute('aria-atomic', 'true');
      announceRef.current.className = 'sr-only';
      document.body.appendChild(announceRef.current);
    }
    
    // Clear previous message
    announceRef.current.textContent = '';
    
    // Set new message after a brief delay to ensure screen readers pick it up
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = message;
      }
    }, 100);
  }, []);
  
  useEffect(() => {
    return () => {
      if (announceRef.current) {
        document.body.removeChild(announceRef.current);
      }
    };
  }, []);
  
  return { announce };
};

/**
 * Focus management utilities
 */
export const useFocusManagement = () => {
  const focusHistoryRef = useRef([]);
  
  const saveFocus = useCallback(() => {
    const activeElement = document.activeElement;
    if (activeElement && activeElement !== document.body) {
      focusHistoryRef.current.push(activeElement);
    }
  }, []);
  
  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistoryRef.current.pop();
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try {
        lastFocused.focus();
      } catch (error) {
        console.warn('Could not restore focus:', error);
      }
    }
  }, []);
  
  const trapFocus = useCallback((container) => {
    if (!container) return;
    
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (event) => {
      if (event.key !== 'Tab') return;
      
      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, []);
  
  return {
    saveFocus,
    restoreFocus,
    trapFocus,
  };
};

export default {
  KEYBOARD_SHORTCUTS,
  useKeyboardShortcuts,
  useSidebarKeyboardShortcuts,
  KeyboardShortcutsHelp,
  useKeyboardAnnouncements,
  useFocusManagement,
  formatShortcut,
  matchesShortcut,
};
