import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage utility functions for offline data persistence
export const storage = {
  // Store data
  setItem: async (key, value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  // Get data
  getItem: async (key) => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  // Remove data
  removeItem: async (key) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  // Clear all data
  clear: async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Get all keys
  getAllKeys: async () => {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Error getting keys:', error);
      return [];
    }
  },
};

// Specific storage keys
export const STORAGE_KEYS = {
  CART_DATA: 'cart_data',
  OFFLINE_SALES: 'offline_sales',
  PRODUCTS_CACHE: 'products_cache',
  CUSTOMERS_CACHE: 'customers_cache',
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC: 'last_sync',
};
