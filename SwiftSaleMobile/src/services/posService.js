import apiClient from './apiClient';
import { API_CONFIG } from '../constants/api';

export const posService = {
  createSale: async (saleData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.POS_SALES, saleData);
    return response;
  },

  getSales: async ({ page = 1, startDate = null, endDate = null }) => {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.SALES}?${params}`);
    return response;
  },

  getSale: async (id) => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.SALES}/${id}`);
    return response;
  },

  getDashboardStats: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.DASHBOARD_STATS);
    return response;
  },
};
