import AsyncStorage from '@react-native-async-storage/async-storage';

// Debug levels
export const DEBUG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

// Log categories
export const LOG_CATEGORIES = {
  AUTH: 'AUTH',
  DATABASE: 'DATABASE',
  API: 'API',
  UI: 'UI',
  NAVIGATION: 'NAVIGATION',
  STORAGE: 'STORAGE',
  INIT: 'INIT',
  POS: 'POS',
  PRODUCTS: 'PRODUCTS',
  CUSTOMERS: 'CUSTOMERS',
  SALES: 'SALES'
};

class DebugLogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000; // Keep last 1000 logs
    this.isEnabled = true; // Always enable logging for debugging
  }

  // Format log entry
  formatLog(level, category, operation, data, error = null) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      id: Date.now() + Math.random(),
      timestamp,
      level,
      category,
      operation,
      data: this.sanitizeData(data),
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : null
    };

    return logEntry;
  }

  // Sanitize sensitive data
  sanitizeData(data) {
    if (!data) return null;
    
    const sanitized = { ...data };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'auth'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '***HIDDEN***';
      }
    });

    // Truncate long strings
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'string' && sanitized[key].length > 200) {
        sanitized[key] = sanitized[key].substring(0, 200) + '...';
      }
    });

    return sanitized;
  }

  // Core logging method
  log(level, category, operation, data, error = null) {
    if (!this.isEnabled) return;

    const logEntry = this.formatLog(level, category, operation, data, error);
    
    // Add to memory logs
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // Remove oldest log
    }

    // Console output with colors
    const prefix = `[${level}] [${category}] ${logEntry.timestamp}`;
    const message = `${operation}:`;
    
    switch (level) {
      case DEBUG_LEVELS.ERROR:
        console.error(prefix, message, data, error);
        break;
      case DEBUG_LEVELS.WARN:
        console.warn(prefix, message, data);
        break;
      case DEBUG_LEVELS.INFO:
        console.info(prefix, message, data);
        break;
      case DEBUG_LEVELS.DEBUG:
        console.log(prefix, message, data);
        break;
    }

    // Save to persistent storage (async, don't wait)
    this.saveToPersistentStorage(logEntry);
  }

  // Convenience methods
  error(category, operation, data, error) {
    this.log(DEBUG_LEVELS.ERROR, category, operation, data, error);
  }

  warn(category, operation, data) {
    this.log(DEBUG_LEVELS.WARN, category, operation, data);
  }

  info(category, operation, data) {
    this.log(DEBUG_LEVELS.INFO, category, operation, data);
  }

  debug(category, operation, data) {
    this.log(DEBUG_LEVELS.DEBUG, category, operation, data);
  }

  // Save logs to AsyncStorage
  async saveToPersistentStorage(logEntry) {
    try {
      const existingLogs = await AsyncStorage.getItem('debug_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      
      logs.push(logEntry);
      
      // Keep only last 500 logs in storage
      if (logs.length > 500) {
        logs.splice(0, logs.length - 500);
      }
      
      await AsyncStorage.setItem('debug_logs', JSON.stringify(logs));
    } catch (error) {
      console.error('Failed to save log to storage:', error);
    }
  }

  // Get all logs from memory
  getLogs(category = null, level = null) {
    let filteredLogs = [...this.logs];
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  // Get logs from persistent storage
  async getPersistedLogs() {
    try {
      const logs = await AsyncStorage.getItem('debug_logs');
      return logs ? JSON.parse(logs) : [];
    } catch (error) {
      console.error('Failed to get persisted logs:', error);
      return [];
    }
  }

  // Clear all logs
  async clearLogs() {
    this.logs = [];
    try {
      await AsyncStorage.removeItem('debug_logs');
    } catch (error) {
      console.error('Failed to clear persisted logs:', error);
    }
  }

  // Export logs as text
  exportLogs() {
    const logs = this.getLogs();
    return logs.map(log => {
      const errorInfo = log.error ? `\nError: ${log.error.message}\nStack: ${log.error.stack}` : '';
      return `[${log.timestamp}] [${log.level}] [${log.category}] ${log.operation}\nData: ${JSON.stringify(log.data, null, 2)}${errorInfo}\n---`;
    }).join('\n');
  }

  // Get statistics
  getStats() {
    const logs = this.getLogs();
    const stats = {
      total: logs.length,
      byLevel: {},
      byCategory: {},
      errors: logs.filter(log => log.level === DEBUG_LEVELS.ERROR).length,
      warnings: logs.filter(log => log.level === DEBUG_LEVELS.WARN).length
    };

    logs.forEach(log => {
      stats.byLevel[log.level] = (stats.byLevel[log.level] || 0) + 1;
      stats.byCategory[log.category] = (stats.byCategory[log.category] || 0) + 1;
    });

    return stats;
  }
}

// Create singleton instance
const debugLogger = new DebugLogger();

export default debugLogger;

// Convenience exports for common operations
export const logError = (category, operation, data, error) => 
  debugLogger.error(category, operation, data, error);

export const logWarn = (category, operation, data) => 
  debugLogger.warn(category, operation, data);

export const logInfo = (category, operation, data) => 
  debugLogger.info(category, operation, data);

export const logDebug = (category, operation, data) => 
  debugLogger.debug(category, operation, data);

// Specific loggers for common operations
export const logAuthOperation = (operation, data, error = null) => {
  if (error) {
    debugLogger.error(LOG_CATEGORIES.AUTH, operation, data, error);
  } else {
    debugLogger.info(LOG_CATEGORIES.AUTH, operation, data);
  }
};

export const logDatabaseOperation = (operation, data, error = null) => {
  if (error) {
    debugLogger.error(LOG_CATEGORIES.DATABASE, operation, data, error);
  } else {
    debugLogger.debug(LOG_CATEGORIES.DATABASE, operation, data);
  }
};

export const logApiOperation = (operation, data, error = null) => {
  if (error) {
    debugLogger.error(LOG_CATEGORIES.API, operation, data, error);
  } else {
    debugLogger.info(LOG_CATEGORIES.API, operation, data);
  }
};

export const logUIOperation = (operation, data, error = null) => {
  if (error) {
    debugLogger.error(LOG_CATEGORIES.UI, operation, data, error);
  } else {
    debugLogger.debug(LOG_CATEGORIES.UI, operation, data);
  }
};
