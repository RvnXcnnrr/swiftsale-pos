# SwiftSale Sidebar Plugin Development Guide

## 📋 Overview

The SwiftSale Enhanced Sidebar includes a powerful plugin system that allows developers to extend functionality with custom features, integrations, and widgets. This guide provides comprehensive instructions for developing, testing, and deploying sidebar plugins.

## 🏗️ Plugin Architecture

### Plugin Types
- **Menu Items**: Custom navigation items and actions
- **Search Providers**: External search integrations
- **Analytics Widgets**: Custom dashboard components
- **Theme Extensions**: Custom themes and styling
- **Keyboard Shortcuts**: Custom hotkey handlers
- **Notification Providers**: Real-time notification systems

### Plugin Lifecycle
1. **Registration**: Plugin is registered with the plugin manager
2. **Installation**: Plugin dependencies are checked and installed
3. **Activation**: Plugin hooks are registered and component is mounted
4. **Execution**: Plugin responds to events and user interactions
5. **Deactivation**: Plugin is disabled but remains installed
6. **Uninstallation**: Plugin is completely removed

## 🚀 Quick Start

### Basic Plugin Structure
```javascript
import { SidebarPlugin, PLUGIN_TYPES } from '../utils/sidebarPluginSystem';

class MyCustomPlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'my-custom-plugin',
      name: 'My Custom Plugin',
      version: '1.0.0',
      type: PLUGIN_TYPES.MENU_ITEM,
      component: MyCustomComponent,
      settings: {
        enabled: true,
        customSetting: 'default value'
      }
    });
  }
}

const MyCustomComponent = ({ customSetting }) => (
  <div className="my-custom-plugin">
    <h4>My Custom Feature</h4>
    <p>Setting: {customSetting}</p>
  </div>
);

export default MyCustomPlugin;
```

### Plugin Registration
```javascript
import { getPluginManager } from '../utils/sidebarPluginSystem';
import MyCustomPlugin from './MyCustomPlugin';

// Register the plugin
const manager = getPluginManager();
const pluginId = manager.register(new MyCustomPlugin());

console.log(`Plugin registered with ID: ${pluginId}`);
```

## 📚 Plugin Types Guide

### 1. Menu Item Plugins
Add custom navigation items to the sidebar menu.

```javascript
import { CustomMenuItemPlugin } from '../utils/sidebarPluginSystem';

class CustomMenuPlugin extends CustomMenuItemPlugin {
  constructor() {
    super({
      id: 'custom-menu-item',
      name: 'Custom Menu Item',
      component: CustomMenuComponent,
      priority: 10, // Lower numbers appear first
      settings: {
        icon: '🔧',
        label: 'Custom Tool',
        url: '/custom-tool'
      }
    });
  }
}

const CustomMenuComponent = ({ icon, label, url }) => (
  <div className="custom-menu-item">
    <a href={url} className="menu-link">
      <span className="menu-icon">{icon}</span>
      <span className="menu-label">{label}</span>
    </a>
  </div>
);
```

### 2. Search Provider Plugins
Integrate external search sources.

```javascript
import { SearchProviderPlugin, PLUGIN_HOOKS } from '../utils/sidebarPluginSystem';

class ExternalSearchPlugin extends SearchProviderPlugin {
  constructor() {
    super({
      id: 'external-search',
      name: 'External Search Provider',
      hooks: {
        [PLUGIN_HOOKS.ON_SEARCH]: this.handleSearch.bind(this)
      }
    });
  }

  async handleSearch(query) {
    // Implement your search logic
    const results = await fetch(`/api/external-search?q=${query}`)
      .then(response => response.json());
    
    return results.map(item => ({
      id: item.id,
      title: item.title,
      type: 'external',
      url: item.url
    }));
  }
}
```

### 3. Analytics Widget Plugins
Add custom widgets to the analytics dashboard.

```javascript
import { AnalyticsWidgetPlugin } from '../utils/sidebarPluginSystem';

class SalesWidgetPlugin extends AnalyticsWidgetPlugin {
  constructor() {
    super({
      id: 'sales-widget',
      name: 'Sales Analytics Widget',
      component: SalesWidget,
      settings: {
        refreshInterval: 60000, // 1 minute
        showTrends: true
      }
    });
  }
}

const SalesWidget = ({ refreshInterval, showTrends }) => {
  const [salesData, setSalesData] = React.useState(null);

  React.useEffect(() => {
    const fetchSalesData = async () => {
      const data = await fetch('/api/sales/summary').then(r => r.json());
      setSalesData(data);
    };

    fetchSalesData();
    const interval = setInterval(fetchSalesData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [refreshInterval]);

  return (
    <div className="sales-widget">
      <h4>Sales Summary</h4>
      {salesData && (
        <div className="sales-metrics">
          <div className="metric">
            <span className="label">Today's Sales</span>
            <span className="value">${salesData.today}</span>
          </div>
          {showTrends && (
            <div className="trend">
              <span className="trend-indicator">
                {salesData.trend > 0 ? '📈' : '📉'}
              </span>
              <span className="trend-value">{salesData.trend}%</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### 4. Theme Extension Plugins
Create custom themes and styling extensions.

```javascript
import { ThemeExtensionPlugin, PLUGIN_HOOKS } from '../utils/sidebarPluginSystem';

class CustomThemePlugin extends ThemeExtensionPlugin {
  constructor() {
    super({
      id: 'custom-theme',
      name: 'Custom Theme Extension',
      hooks: {
        [PLUGIN_HOOKS.ON_THEME_CHANGE]: this.handleThemeChange.bind(this)
      },
      settings: {
        primaryColor: '#FF6B35',
        secondaryColor: '#2C3E50',
        customCSS: ''
      }
    });
  }

  async handleThemeChange(theme) {
    const { primaryColor, secondaryColor, customCSS } = this.settings;
    
    // Apply custom CSS variables
    document.documentElement.style.setProperty('--custom-primary', primaryColor);
    document.documentElement.style.setProperty('--custom-secondary', secondaryColor);
    
    // Inject custom CSS
    if (customCSS) {
      this.injectCustomCSS(customCSS);
    }
  }

  injectCustomCSS(css) {
    const styleId = `custom-theme-${this.id}`;
    let styleElement = document.getElementById(styleId);
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    
    styleElement.textContent = css;
  }
}
```

## 🔧 Plugin Configuration

### Settings Management
```javascript
class ConfigurablePlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'configurable-plugin',
      name: 'Configurable Plugin',
      settings: {
        apiKey: '',
        refreshRate: 30000,
        enableNotifications: true,
        customOptions: {
          theme: 'light',
          language: 'en'
        }
      }
    });
  }

  // Update settings
  updateConfiguration(newSettings) {
    this.updateSettings(newSettings);
    this.applySettings();
  }

  applySettings() {
    const apiKey = this.getSetting('apiKey');
    const refreshRate = this.getSetting('refreshRate', 30000);
    
    // Apply configuration changes
    if (apiKey) {
      this.initializeAPI(apiKey);
    }
    
    this.setRefreshRate(refreshRate);
  }
}
```

### Plugin Dependencies
```javascript
class DependentPlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'dependent-plugin',
      name: 'Plugin with Dependencies',
      dependencies: ['base-plugin', 'utility-plugin'],
      // ... other config
    });
  }
}
```

## 🧪 Testing Plugins

### Unit Testing
```javascript
import { render, screen } from '@testing-library/react';
import { PluginProvider } from '../utils/sidebarPluginSystem';
import MyCustomPlugin from './MyCustomPlugin';

describe('MyCustomPlugin', () => {
  test('should render correctly', () => {
    const plugin = new MyCustomPlugin();
    
    render(
      <PluginProvider>
        <plugin.component {...plugin.settings} />
      </PluginProvider>
    );
    
    expect(screen.getByText('My Custom Feature')).toBeInTheDocument();
  });

  test('should handle settings updates', () => {
    const plugin = new MyCustomPlugin();
    
    plugin.updateSettings({ customSetting: 'new value' });
    
    expect(plugin.getSetting('customSetting')).toBe('new value');
  });
});
```

### Integration Testing
```javascript
import { getPluginManager } from '../utils/sidebarPluginSystem';
import MyCustomPlugin from './MyCustomPlugin';

describe('Plugin Integration', () => {
  let manager;
  let plugin;

  beforeEach(() => {
    manager = getPluginManager();
    plugin = new MyCustomPlugin();
  });

  test('should register plugin successfully', () => {
    const pluginId = manager.register(plugin);
    
    expect(pluginId).toBe(plugin.id);
    expect(manager.getPlugin(pluginId)).toBe(plugin);
  });

  test('should execute hooks correctly', async () => {
    manager.register(plugin);
    
    const results = await manager.executeHook('test_hook', 'test_data');
    
    expect(results).toBeDefined();
  });
});
```

## 📦 Plugin Distribution

### Plugin Package Structure
```
my-sidebar-plugin/
├── package.json
├── README.md
├── src/
│   ├── index.js
│   ├── components/
│   │   └── PluginComponent.js
│   ├── styles/
│   │   └── plugin.scss
│   └── utils/
│       └── helpers.js
├── tests/
│   └── plugin.test.js
└── docs/
    └── usage.md
```

### Package.json Example
```json
{
  "name": "swiftsale-sidebar-plugin-example",
  "version": "1.0.0",
  "description": "Example plugin for SwiftSale Enhanced Sidebar",
  "main": "src/index.js",
  "keywords": ["swiftsale", "sidebar", "plugin"],
  "peerDependencies": {
    "react": "^17.0.0 || ^18.0.0",
    "react-dom": "^17.0.0 || ^18.0.0"
  },
  "swiftsale": {
    "pluginType": "menu_item",
    "minSidebarVersion": "2.0.0",
    "permissions": ["read:menu", "write:analytics"]
  }
}
```

### Plugin Installation
```bash
# Install via npm
npm install swiftsale-sidebar-plugin-example

# Register in your application
import ExamplePlugin from 'swiftsale-sidebar-plugin-example';
import { getPluginManager } from './utils/sidebarPluginSystem';

const manager = getPluginManager();
manager.register(new ExamplePlugin());
```

## 🔒 Security Considerations

### Plugin Permissions
```javascript
class SecurePlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'secure-plugin',
      name: 'Secure Plugin',
      permissions: ['read:analytics', 'write:settings'],
      // ... other config
    });
  }

  async executeSecureAction() {
    if (!this.hasPermission('write:settings')) {
      throw new Error('Insufficient permissions');
    }
    
    // Perform secure action
  }

  hasPermission(permission) {
    return this.permissions.includes(permission);
  }
}
```

### Input Sanitization
```javascript
class SafePlugin extends SidebarPlugin {
  sanitizeInput(input) {
    // Remove potentially dangerous content
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .trim();
  }

  handleUserInput(input) {
    const sanitized = this.sanitizeInput(input);
    // Process sanitized input
  }
}
```

## 📈 Performance Best Practices

### Lazy Loading
```javascript
class OptimizedPlugin extends SidebarPlugin {
  constructor() {
    super({
      id: 'optimized-plugin',
      name: 'Optimized Plugin',
      component: React.lazy(() => import('./LazyComponent')),
      // ... other config
    });
  }
}
```

### Memory Management
```javascript
class MemoryEfficientPlugin extends SidebarPlugin {
  constructor() {
    super(/* config */);
    this.cleanup = [];
  }

  activate() {
    super.activate();
    
    // Set up event listeners
    const listener = this.handleEvent.bind(this);
    document.addEventListener('custom-event', listener);
    
    // Track for cleanup
    this.cleanup.push(() => {
      document.removeEventListener('custom-event', listener);
    });
  }

  deactivate() {
    // Clean up resources
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
    
    super.deactivate();
  }
}
```

## 🎯 Plugin Examples Repository

Check out the official plugin examples repository for more comprehensive examples:
- Weather Widget Plugin
- Task Management Plugin
- Quick Actions Plugin
- Notification Center Plugin
- Custom Theme Plugin

## 📞 Support & Resources

- **Documentation**: [Plugin API Reference](./PLUGIN_API.md)
- **Examples**: [Plugin Examples Repository](./examples/)
- **Community**: [SwiftSale Plugin Community](https://community.swiftsale.com)
- **Issues**: [Report Plugin Issues](https://github.com/swiftsale/sidebar-plugins/issues)

---

**Plugin System Version**: 2.0.0  
**Last Updated**: 2025-07-11  
**Compatibility**: SwiftSale Enhanced Sidebar 2.0.0+
