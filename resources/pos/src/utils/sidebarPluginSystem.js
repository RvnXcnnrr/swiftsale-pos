/**
 * Sidebar Plugin System
 * Extensible architecture for custom sidebar features and integrations
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Plugin types
export const PLUGIN_TYPES = {
  MENU_ITEM: 'menu_item',
  SEARCH_PROVIDER: 'search_provider',
  ANALYTICS_WIDGET: 'analytics_widget',
  THEME_EXTENSION: 'theme_extension',
  KEYBOARD_SHORTCUT: 'keyboard_shortcut',
  NOTIFICATION_PROVIDER: 'notification_provider',
};

// Plugin lifecycle hooks
export const PLUGIN_HOOKS = {
  BEFORE_RENDER: 'before_render',
  AFTER_RENDER: 'after_render',
  ON_SEARCH: 'on_search',
  ON_MENU_CLICK: 'on_menu_click',
  ON_THEME_CHANGE: 'on_theme_change',
  ON_SETTINGS_CHANGE: 'on_settings_change',
};

/**
 * Base Plugin Class
 */
export class SidebarPlugin {
  constructor(config = {}) {
    this.id = config.id || this.generateId();
    this.name = config.name || 'Unnamed Plugin';
    this.version = config.version || '1.0.0';
    this.type = config.type || PLUGIN_TYPES.MENU_ITEM;
    this.enabled = config.enabled !== false;
    this.dependencies = config.dependencies || [];
    this.hooks = config.hooks || {};
    this.settings = config.settings || {};
    this.component = config.component || null;
    this.priority = config.priority || 100;
  }

  generateId() {
    return `plugin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Plugin lifecycle methods
  async install() {
    console.log(`Installing plugin: ${this.name}`);
    return true;
  }

  async uninstall() {
    console.log(`Uninstalling plugin: ${this.name}`);
    return true;
  }

  async activate() {
    this.enabled = true;
    console.log(`Activated plugin: ${this.name}`);
    return true;
  }

  async deactivate() {
    this.enabled = false;
    console.log(`Deactivated plugin: ${this.name}`);
    return true;
  }

  // Hook execution
  executeHook(hookName, ...args) {
    if (this.hooks[hookName] && typeof this.hooks[hookName] === 'function') {
      return this.hooks[hookName](...args);
    }
    return null;
  }

  // Settings management
  updateSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
  }

  getSetting(key, defaultValue = null) {
    return this.settings[key] || defaultValue;
  }
}

/**
 * Plugin Manager
 */
export class PluginManager {
  constructor() {
    this.plugins = new Map();
    this.hooks = new Map();
    this.eventListeners = new Map();
  }

  // Plugin registration
  register(plugin) {
    if (!(plugin instanceof SidebarPlugin)) {
      throw new Error('Plugin must be an instance of SidebarPlugin');
    }

    // Check dependencies
    for (const depId of plugin.dependencies) {
      if (!this.plugins.has(depId)) {
        throw new Error(`Plugin dependency not found: ${depId}`);
      }
    }

    this.plugins.set(plugin.id, plugin);
    this.registerHooks(plugin);
    
    console.log(`Registered plugin: ${plugin.name} (${plugin.id})`);
    return plugin.id;
  }

  // Plugin unregistration
  unregister(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      this.unregisterHooks(plugin);
      this.plugins.delete(pluginId);
      console.log(`Unregistered plugin: ${plugin.name}`);
      return true;
    }
    return false;
  }

  // Hook management
  registerHooks(plugin) {
    Object.keys(plugin.hooks).forEach(hookName => {
      if (!this.hooks.has(hookName)) {
        this.hooks.set(hookName, []);
      }
      
      this.hooks.get(hookName).push({
        pluginId: plugin.id,
        callback: plugin.hooks[hookName],
        priority: plugin.priority,
      });

      // Sort by priority
      this.hooks.get(hookName).sort((a, b) => a.priority - b.priority);
    });
  }

  unregisterHooks(plugin) {
    Object.keys(plugin.hooks).forEach(hookName => {
      if (this.hooks.has(hookName)) {
        const hooks = this.hooks.get(hookName);
        const filtered = hooks.filter(hook => hook.pluginId !== plugin.id);
        this.hooks.set(hookName, filtered);
      }
    });
  }

  // Hook execution
  async executeHook(hookName, ...args) {
    const hooks = this.hooks.get(hookName) || [];
    const results = [];

    for (const hook of hooks) {
      const plugin = this.plugins.get(hook.pluginId);
      if (plugin && plugin.enabled) {
        try {
          const result = await hook.callback(...args);
          results.push(result);
        } catch (error) {
          console.error(`Error executing hook ${hookName} for plugin ${plugin.name}:`, error);
        }
      }
    }

    return results;
  }

  // Plugin queries
  getPlugin(pluginId) {
    return this.plugins.get(pluginId);
  }

  getPluginsByType(type) {
    return Array.from(this.plugins.values()).filter(plugin => plugin.type === type);
  }

  getEnabledPlugins() {
    return Array.from(this.plugins.values()).filter(plugin => plugin.enabled);
  }

  getAllPlugins() {
    return Array.from(this.plugins.values());
  }

  // Plugin state management
  enablePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      return plugin.activate();
    }
    return false;
  }

  disablePlugin(pluginId) {
    const plugin = this.plugins.get(pluginId);
    if (plugin) {
      return plugin.deactivate();
    }
    return false;
  }

  // Event system
  addEventListener(event, callback) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event).push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners.has(event)) {
      const listeners = this.eventListeners.get(event);
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, ...args) {
    const listeners = this.eventListeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(...args);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }
}

// Global plugin manager instance
const globalPluginManager = new PluginManager();

/**
 * Plugin Context for React components
 */
const PluginContext = createContext();

export const PluginProvider = ({ children }) => {
  const [pluginManager] = useState(() => globalPluginManager);
  const [plugins, setPlugins] = useState([]);

  useEffect(() => {
    const updatePlugins = () => {
      setPlugins(pluginManager.getAllPlugins());
    };

    // Listen for plugin changes
    pluginManager.addEventListener('plugin_registered', updatePlugins);
    pluginManager.addEventListener('plugin_unregistered', updatePlugins);
    pluginManager.addEventListener('plugin_enabled', updatePlugins);
    pluginManager.addEventListener('plugin_disabled', updatePlugins);

    // Initial load
    updatePlugins();

    return () => {
      pluginManager.removeEventListener('plugin_registered', updatePlugins);
      pluginManager.removeEventListener('plugin_unregistered', updatePlugins);
      pluginManager.removeEventListener('plugin_enabled', updatePlugins);
      pluginManager.removeEventListener('plugin_disabled', updatePlugins);
    };
  }, [pluginManager]);

  return (
    <PluginContext.Provider value={{ pluginManager, plugins }}>
      {children}
    </PluginContext.Provider>
  );
};

/**
 * Hook to use plugin system
 */
export const usePlugins = () => {
  const context = useContext(PluginContext);
  if (!context) {
    throw new Error('usePlugins must be used within a PluginProvider');
  }
  return context;
};

/**
 * Hook to render plugin components
 */
export const usePluginComponents = (type) => {
  const { plugins } = usePlugins();
  
  return plugins
    .filter(plugin => plugin.type === type && plugin.enabled && plugin.component)
    .sort((a, b) => a.priority - b.priority)
    .map(plugin => ({
      id: plugin.id,
      component: plugin.component,
      props: plugin.settings,
    }));
};

/**
 * Plugin Component Renderer
 */
export const PluginRenderer = ({ type, className = '', ...props }) => {
  const components = usePluginComponents(type);

  if (components.length === 0) {
    return null;
  }

  return (
    <div className={`plugin-container plugin-type-${type} ${className}`}>
      {components.map(({ id, component: Component, props: pluginProps }) => (
        <div key={id} className={`plugin-wrapper plugin-${id}`}>
          <Component {...pluginProps} {...props} />
        </div>
      ))}
    </div>
  );
};

/**
 * Built-in plugin examples
 */

// Example: Custom Menu Item Plugin
export class CustomMenuItemPlugin extends SidebarPlugin {
  constructor(config) {
    super({
      type: PLUGIN_TYPES.MENU_ITEM,
      ...config,
    });
  }
}

// Example: Search Provider Plugin
export class SearchProviderPlugin extends SidebarPlugin {
  constructor(config) {
    super({
      type: PLUGIN_TYPES.SEARCH_PROVIDER,
      hooks: {
        [PLUGIN_HOOKS.ON_SEARCH]: this.handleSearch.bind(this),
      },
      ...config,
    });
  }

  async handleSearch(query) {
    // Override this method in subclasses
    return [];
  }
}

// Example: Analytics Widget Plugin
export class AnalyticsWidgetPlugin extends SidebarPlugin {
  constructor(config) {
    super({
      type: PLUGIN_TYPES.ANALYTICS_WIDGET,
      ...config,
    });
  }
}

// Example: Theme Extension Plugin
export class ThemeExtensionPlugin extends SidebarPlugin {
  constructor(config) {
    super({
      type: PLUGIN_TYPES.THEME_EXTENSION,
      hooks: {
        [PLUGIN_HOOKS.ON_THEME_CHANGE]: this.handleThemeChange.bind(this),
      },
      ...config,
    });
  }

  async handleThemeChange(theme) {
    // Override this method in subclasses
    console.log(`Theme changed to: ${theme}`);
  }
}

// Export the global plugin manager
export const getPluginManager = () => globalPluginManager;

/**
 * Example Plugin Implementations
 */

// Quick Actions Plugin
export class QuickActionsPlugin extends CustomMenuItemPlugin {
  constructor() {
    super({
      id: 'quick-actions',
      name: 'Quick Actions',
      version: '1.0.0',
      component: QuickActionsComponent,
      priority: 10,
      settings: {
        actions: [
          { id: 'new-sale', label: 'New Sale', icon: '💰', action: () => console.log('New Sale') },
          { id: 'inventory', label: 'Check Inventory', icon: '📦', action: () => console.log('Inventory') },
          { id: 'reports', label: 'Quick Reports', icon: '📊', action: () => console.log('Reports') },
        ]
      }
    });
  }
}

// Quick Actions Component
const QuickActionsComponent = ({ actions = [] }) => (
  <div className="quick-actions-plugin">
    <h4>Quick Actions</h4>
    <div className="action-buttons">
      {actions.map(action => (
        <button
          key={action.id}
          onClick={action.action}
          className="quick-action-btn"
          title={action.label}
        >
          <span className="action-icon">{action.icon}</span>
          <span className="action-label">{action.label}</span>
        </button>
      ))}
    </div>
  </div>
);

// Weather Widget Plugin
export class WeatherWidgetPlugin extends AnalyticsWidgetPlugin {
  constructor() {
    super({
      id: 'weather-widget',
      name: 'Weather Widget',
      version: '1.0.0',
      component: WeatherComponent,
      priority: 50,
      settings: {
        location: 'New York',
        units: 'metric'
      }
    });
  }
}

// Weather Component
const WeatherComponent = ({ location = 'New York', units = 'metric' }) => {
  const [weather, setWeather] = React.useState(null);

  React.useEffect(() => {
    // Mock weather data
    setWeather({
      temperature: units === 'metric' ? '22°C' : '72°F',
      condition: 'Sunny',
      icon: '☀️'
    });
  }, [location, units]);

  return (
    <div className="weather-widget-plugin">
      <h4>Weather in {location}</h4>
      {weather && (
        <div className="weather-info">
          <span className="weather-icon">{weather.icon}</span>
          <span className="weather-temp">{weather.temperature}</span>
          <span className="weather-condition">{weather.condition}</span>
        </div>
      )}
    </div>
  );
};

// Notification Center Plugin
export class NotificationCenterPlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'notification-center',
      name: 'Notification Center',
      type: PLUGIN_TYPES.NOTIFICATION_PROVIDER,
      version: '1.0.0',
      component: NotificationCenterComponent,
      priority: 20,
      hooks: {
        [PLUGIN_HOOKS.AFTER_RENDER]: this.checkNotifications.bind(this),
      },
      settings: {
        maxNotifications: 5,
        autoRefresh: true,
        refreshInterval: 30000, // 30 seconds
      }
    });
  }

  async checkNotifications() {
    // Mock notification checking
    console.log('Checking for new notifications...');
  }
}

// Notification Center Component
const NotificationCenterComponent = ({ maxNotifications = 5 }) => {
  const [notifications, setNotifications] = React.useState([
    { id: 1, type: 'info', message: 'New order received', time: '2 min ago' },
    { id: 2, type: 'warning', message: 'Low inventory alert', time: '5 min ago' },
    { id: 3, type: 'success', message: 'Payment processed', time: '10 min ago' },
  ]);

  return (
    <div className="notification-center-plugin">
      <h4>Notifications</h4>
      <div className="notification-list">
        {notifications.slice(0, maxNotifications).map(notification => (
          <div key={notification.id} className={`notification-item ${notification.type}`}>
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">{notification.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Plugin Registration Helper
 */
export const registerBuiltInPlugins = () => {
  const manager = getPluginManager();

  // Register built-in plugins
  manager.register(new QuickActionsPlugin());
  manager.register(new WeatherWidgetPlugin());
  manager.register(new NotificationCenterPlugin());

  console.log('Built-in plugins registered');
};

/**
 * Plugin Development Utilities
 */
export const createPlugin = (config) => {
  return new SidebarPlugin(config);
};

export const createMenuItemPlugin = (config) => {
  return new CustomMenuItemPlugin(config);
};

export const createSearchProviderPlugin = (config) => {
  return new SearchProviderPlugin(config);
};

export const createAnalyticsWidgetPlugin = (config) => {
  return new AnalyticsWidgetPlugin(config);
};

export const createThemeExtensionPlugin = (config) => {
  return new ThemeExtensionPlugin(config);
};

export default {
  SidebarPlugin,
  PluginManager,
  PluginProvider,
  PluginRenderer,
  usePlugins,
  usePluginComponents,
  getPluginManager,
  PLUGIN_TYPES,
  PLUGIN_HOOKS,
  CustomMenuItemPlugin,
  SearchProviderPlugin,
  AnalyticsWidgetPlugin,
  ThemeExtensionPlugin,
  QuickActionsPlugin,
  WeatherWidgetPlugin,
  NotificationCenterPlugin,
  registerBuiltInPlugins,
  createPlugin,
  createMenuItemPlugin,
  createSearchProviderPlugin,
  createAnalyticsWidgetPlugin,
  createThemeExtensionPlugin,
};
