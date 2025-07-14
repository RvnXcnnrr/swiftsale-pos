import apiClient from './apiClient';
import { API_CONFIG } from '../constants/api';

export const customerService = {
  getCustomers: async ({ search = '' }) => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS}?${params}`);
    return response;
  },

  createCustomer: async (customerData) => {
    const response = await apiClient.post(API_CONFIG.ENDPOINTS.CUSTOMERS, customerData);
    return response;
  },

  getCustomer: async (id) => {
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`);
    return response;
  },

  updateCustomer: async (id, customerData) => {
    const response = await apiClient.put(`${API_CONFIG.ENDPOINTS.CUSTOMERS}/${id}`, customerData);
    return response;
  },
};
