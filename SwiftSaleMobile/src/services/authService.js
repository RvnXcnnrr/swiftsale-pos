import apiClient from './apiClient';
import { API_CONFIG } from '../constants/api';

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGIN, {
      email,
      password,
    });
    return response;
  },

  logout: async () => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.LOGOUT);
    return response;
  },

  refreshToken: async () => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.REFRESH);
    return response;
  },
};
