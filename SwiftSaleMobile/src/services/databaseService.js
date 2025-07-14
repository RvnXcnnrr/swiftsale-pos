import AsyncStorage from '@react-native-async-storage/async-storage';
import { logDatabaseOperation } from '../utils/debugLogger';

// Storage keys for different data types
const STORAGE_KEYS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BRANDS: 'brands',
  CUSTOMERS: 'customers',
  SALES: 'sales',
  SALE_ITEMS: 'sale_items',
  SETTINGS: 'settings',
  INITIALIZED: 'db_initialized'
};

// Database service class using AsyncStorage
class DatabaseService {
  constructor() {
    this.nextId = 1;
    this.initDatabase();
  }

  // Initialize database
  async initDatabase() {
    try {
      const initialized = await AsyncStorage.getItem(STORAGE_KEYS.INITIALIZED);
      if (!initialized) {
        // Initialize empty collections
        await this.initializeCollections();
        await AsyncStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }

  // Initialize empty collections
  async initializeCollections() {
    const collections = Object.values(STORAGE_KEYS).filter(key => key !== 'INITIALIZED');
    for (const collection of collections) {
      await AsyncStorage.setItem(collection, JSON.stringify([]));
    }
  }

  // Get next available ID for a collection
  async getNextId(collection) {
    try {
      const data = await this.getCollection(collection);
      const maxId = data.length > 0 ? Math.max(...data.map(item => item.id || 0)) : 0;
      return maxId + 1;
    } catch (error) {
      return 1;
    }
  }

  // Get entire collection
  async getCollection(collection) {
    try {
      logDatabaseOperation(`getCollection(${collection})`, { collection });
      const data = await AsyncStorage.getItem(collection);
      const result = data ? JSON.parse(data) : [];
      logDatabaseOperation(`getCollection(${collection}) - SUCCESS`, { collection, count: result.length });
      return result;
    } catch (error) {
      logDatabaseOperation(`getCollection(${collection}) - FAILED`, { collection }, error);
      return [];
    }
  }

  // Save entire collection
  async saveCollection(collection, data) {
    try {
      logDatabaseOperation(`saveCollection(${collection})`, { collection, count: data.length });
      await AsyncStorage.setItem(collection, JSON.stringify(data));
      logDatabaseOperation(`saveCollection(${collection}) - SUCCESS`, { collection, count: data.length });
      return true;
    } catch (error) {
      logDatabaseOperation(`saveCollection(${collection}) - FAILED`, { collection, count: data.length }, error);
      return false;
    }
  }

  // Insert new record
  async insert(collection, data) {
    try {
      logDatabaseOperation(`insert(${collection})`, { collection, data });
      const items = await this.getCollection(collection);
      const id = await this.getNextId(collection);
      const newItem = {
        id,
        ...data,
        created_at: new Date().toISOString()
      };
      items.push(newItem);
      await this.saveCollection(collection, items);
      logDatabaseOperation(`insert(${collection}) - SUCCESS`, { collection, id, newItem });
      return { insertId: id, ...newItem };
    } catch (error) {
      logDatabaseOperation(`insert(${collection}) - FAILED`, { collection, data }, error);
      throw new Error(`Failed to insert into ${collection}: ${error.message}`);
    }
  }

  // Update record
  async update(collection, data, whereField, whereValue) {
    try {
      logDatabaseOperation(`update(${collection})`, { collection, data, whereField, whereValue });
      const items = await this.getCollection(collection);
      const index = items.findIndex(item => item[whereField] === whereValue);
      if (index === -1) {
        logDatabaseOperation(`update(${collection}) - RECORD NOT FOUND`, { collection, whereField, whereValue });
        throw new Error('Record not found');
      }
      items[index] = { ...items[index], ...data };
      await this.saveCollection(collection, items);
      logDatabaseOperation(`update(${collection}) - SUCCESS`, { collection, index, updatedItem: items[index] });
      return items[index];
    } catch (error) {
      logDatabaseOperation(`update(${collection}) - FAILED`, { collection, data, whereField, whereValue }, error);
      throw new Error(`Failed to update ${collection}: ${error.message}`);
    }
  }

  // Delete record
  async delete(collection, whereField, whereValue) {
    try {
      logDatabaseOperation(`delete(${collection})`, { collection, whereField, whereValue });
      const items = await this.getCollection(collection);
      const filteredItems = items.filter(item => item[whereField] !== whereValue);
      await this.saveCollection(collection, filteredItems);
      logDatabaseOperation(`delete(${collection}) - SUCCESS`, { collection, deletedCount: items.length - filteredItems.length });
      return true;
    } catch (error) {
      logDatabaseOperation(`delete(${collection}) - FAILED`, { collection, whereField, whereValue }, error);
      throw new Error(`Failed to delete from ${collection}: ${error.message}`);
    }
  }

  // Get all records
  async getAll(collection) {
    return await this.getCollection(collection);
  }

  // Get record by ID
  async getById(collection, id) {
    try {
      logDatabaseOperation(`getById(${collection})`, { collection, id });
      const items = await this.getCollection(collection);
      const result = items.find(item => item.id === id) || null;
      logDatabaseOperation(`getById(${collection}) - SUCCESS`, { collection, id, found: !!result });
      return result;
    } catch (error) {
      logDatabaseOperation(`getById(${collection}) - FAILED`, { collection, id }, error);
      throw new Error(`Failed to get record from ${collection}: ${error.message}`);
    }
  }

  // Search records
  async search(collection, searchField, searchTerm) {
    try {
      const items = await this.getCollection(collection);
      return items.filter(item =>
        item[searchField] &&
        item[searchField].toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (error) {
      throw new Error(`Failed to search ${collection}: ${error.message}`);
    }
  }

  // Clear specific collection
  async clear(collection) {
    try {
      logDatabaseOperation(`clear(${collection})`, { collection });
      await AsyncStorage.setItem(collection, JSON.stringify([]));
      logDatabaseOperation(`clear(${collection}) - SUCCESS`, { collection });
      return true;
    } catch (error) {
      logDatabaseOperation(`clear(${collection}) - FAILED`, { collection }, error);
      throw new Error(`Failed to clear ${collection}: ${error.message}`);
    }
  }

  // Clear all data
  async clearAllData() {
    try {
      logDatabaseOperation('clearAllData', {});
      const collections = Object.values(STORAGE_KEYS).filter(key => key !== 'INITIALIZED');
      for (const collection of collections) {
        await AsyncStorage.setItem(collection, JSON.stringify([]));
      }
      logDatabaseOperation('clearAllData - SUCCESS', { collectionsCleared: collections.length });
      return true;
    } catch (error) {
      logDatabaseOperation('clearAllData - FAILED', {}, error);
      throw new Error(`Failed to clear data: ${error.message}`);
    }
  }

  // Reset database
  async resetDatabase() {
    try {
      await this.clearAllData();
      await AsyncStorage.removeItem(STORAGE_KEYS.INITIALIZED);
      await this.initDatabase();
      return true;
    } catch (error) {
      throw new Error(`Failed to reset database: ${error.message}`);
    }
  }

  // Query method for compatibility
  async query(collection, options = {}) {
    try {
      const items = await this.getCollection(collection);
      let result = [...items];

      // Apply filters
      if (options.where) {
        result = result.filter(item => {
          return Object.keys(options.where).every(key =>
            item[key] === options.where[key]
          );
        });
      }

      // Apply search
      if (options.search && options.searchFields) {
        const searchTerm = options.search.toLowerCase();
        result = result.filter(item =>
          options.searchFields.some(field =>
            item[field] && item[field].toString().toLowerCase().includes(searchTerm)
          )
        );
      }

      // Apply sorting
      if (options.orderBy) {
        const [field, direction = 'ASC'] = options.orderBy.split(' ');
        result.sort((a, b) => {
          if (direction.toUpperCase() === 'DESC') {
            return b[field] > a[field] ? 1 : -1;
          }
          return a[field] > b[field] ? 1 : -1;
        });
      }

      // Apply pagination
      if (options.limit) {
        const offset = options.offset || 0;
        result = result.slice(offset, offset + options.limit);
      }

      return {
        rows: {
          _array: result,
          length: result.length
        }
      };
    } catch (error) {
      throw new Error(`Query failed: ${error.message}`);
    }
  }
}

// Create and export singleton instance
const databaseService = new DatabaseService();
export default databaseService;
export { STORAGE_KEYS };
