import databaseService, { STORAGE_KEYS } from './databaseService';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { logAuthOperation } from '../utils/debugLogger';

// Cross-platform storage utility
const crossPlatformStorage = {
  async setItem(key, value) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },

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

export const localAuthService = {
  // Login with email and password
  login: async (email, password) => {
    try {
      logAuthOperation('login_attempt', { email, passwordLength: password?.length });

      const users = await databaseService.getAll(STORAGE_KEYS.USERS);
      logAuthOperation('login_users_loaded', { userCount: users.length, users: users.map(u => ({ id: u.id, email: u.email })) });

      // Debug: Log the exact password comparison
      const foundUser = users.find(u => u.email === email);
      if (foundUser) {
        logAuthOperation('login_password_debug', {
          email,
          enteredPassword: `"${password}"`,
          enteredPasswordLength: password.length,
          storedPassword: `"${foundUser.password}"`,
          storedPasswordLength: foundUser.password.length,
          passwordsMatch: foundUser.password === password
        });
      }

      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        const errorData = {
          email,
          availableEmails: users.map(u => u.email),
          passwordMatch: users.find(u => u.email === email) ? 'email_found_password_mismatch' : 'email_not_found'
        };
        logAuthOperation('login_failed_invalid_credentials', errorData, new Error('Invalid email or password'));
        throw new Error('Invalid email or password');
      }

      logAuthOperation('login_user_found', { userId: user.id, userEmail: user.email, userRole: user.role });

      // Generate a simple token (in production, use proper JWT)
      const token = `token_${user.id}_${Date.now()}`;

      // Store token securely
      await crossPlatformStorage.setItem('userToken', token);
      await crossPlatformStorage.setItem('userData', JSON.stringify(user));

      logAuthOperation('login_success', { userId: user.id, token: token.substring(0, 20) + '...' });

      return {
        data: {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: { display_name: user.role }
          }
        }
      };
    } catch (error) {
      logAuthOperation('login_error', { email }, error);
      throw new Error('Login failed: ' + error.message);
    }
  },

  // Logout
  logout: async () => {
    try {
      logAuthOperation('logout_start', {});
      await crossPlatformStorage.removeItem('userToken');
      await crossPlatformStorage.removeItem('userData');
      logAuthOperation('logout_success', {});
      return { success: true };
    } catch (error) {
      logAuthOperation('logout_error', {}, error);
      throw new Error('Logout failed: ' + error.message);
    }
  },

  // Check if user is authenticated
  checkAuth: async () => {
    try {
      const token = await crossPlatformStorage.getItem('userToken');
      const userData = await crossPlatformStorage.getItem('userData');

      if (token && userData) {
        return {
          token,
          user: JSON.parse(userData)
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  },

  // Create default admin user
  createDefaultUser: async () => {
    try {
      logAuthOperation('createDefaultUser_start', {});

      // Check if admin user already exists
      const users = await databaseService.getAll(STORAGE_KEYS.USERS);
      logAuthOperation('createDefaultUser_users_loaded', { userCount: users.length, users: users.map(u => ({ id: u.id, email: u.email })) });

      const existingUser = users.find(u => u.email === 'admin@swiftsale.com');

      if (!existingUser) {
        logAuthOperation('createDefaultUser_creating_new_user', { email: 'admin@swiftsale.com' });

        const result = await databaseService.insert(STORAGE_KEYS.USERS, {
          name: 'Admin User',
          email: 'admin@swiftsale.com',
          password: 'admin123', // In production, hash this password
          role: 'admin'
        });

        logAuthOperation('createDefaultUser_success', { result });
      } else {
        logAuthOperation('createDefaultUser_user_exists', { existingUser: { id: existingUser.id, email: existingUser.email } });
      }
    } catch (error) {
      logAuthOperation('createDefaultUser_error', {}, error);
    }
  },

  // Reset database and recreate default user (for debugging)
  resetAndCreateUser: async () => {
    try {
      logAuthOperation('resetAndCreateUser_start', {});

      // Clear users storage
      await databaseService.clear(STORAGE_KEYS.USERS);
      logAuthOperation('resetAndCreateUser_users_cleared', {});

      // Create default admin user
      const result = await databaseService.insert(STORAGE_KEYS.USERS, {
        name: 'Admin User',
        email: 'admin@swiftsale.com',
        password: 'admin123',
        role: 'admin'
      });

      logAuthOperation('resetAndCreateUser_success', { userId: result.id });
      return result;
    } catch (error) {
      logAuthOperation('resetAndCreateUser_error', {}, error);
      throw error;
    }
  }
};
