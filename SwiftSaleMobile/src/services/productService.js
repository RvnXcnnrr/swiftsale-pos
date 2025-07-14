import apiClient from './apiClient';
import { API_CONFIG } from '../constants/api';

export const productService = {
  getProducts: async ({ page = 1, search = '', categoryId = null, brandId = null }) => {
    const params = new URLSearchParams({
      page: page.toString(),
    });
    
    if (search) params.append('search', search);
    if (categoryId) params.append('category_id', categoryId.toString());
    if (brandId) params.append('brand_id', brandId.toString());
    
    const response = await apiClient.get(`${API_CONFIG.ENDPOINTS.PRODUCTS}?${params}`);
    return response;
  },



  getCategories: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.CATEGORIES);
    return response;
  },

  getBrands: async () => {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.BRANDS);
    return response;
  },
};
