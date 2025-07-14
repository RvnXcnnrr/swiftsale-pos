import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { API_CONFIG, HTTP_STATUS, ERROR_MESSAGES } from '../constants/api';

// Cross-platform storage utility
const crossPlatformStorage = {
  async getItem(key) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },

  async removeItem(key) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await crossPlatformStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to get auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    
    if (!response) {
      // Network error
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    switch (response.status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Clear stored auth data
        await crossPlatformStorage.removeItem('userToken');
        await crossPlatformStorage.removeItem('userData');
        throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
        
      case HTTP_STATUS.FORBIDDEN:
        throw new Error('Access denied');
        
      case HTTP_STATUS.NOT_FOUND:
        throw new Error(ERROR_MESSAGES.NOT_FOUND);
        
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        throw new Error(response.data?.message || ERROR_MESSAGES.VALIDATION_ERROR);
        
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        throw new Error(ERROR_MESSAGES.SERVER_ERROR);
        
      default:
        throw new Error(response.data?.message || ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }
);

export default apiClient;
