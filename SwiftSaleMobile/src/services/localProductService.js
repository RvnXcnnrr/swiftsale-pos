import databaseService, { STORAGE_KEYS } from './databaseService';
import { logInfo, logError, LOG_CATEGORIES } from '../utils/debugLogger';

export const localProductService = {
  // Get all products with category and brand info
  getProducts: async ({ page = 1, search = '', categoryId = null, brandId = null, limit = 20 }) => {
    try {
      logInfo(LOG_CATEGORIES.PRODUCTS, 'getProducts_start', { page, search, categoryId, brandId, limit });

      // Get products, categories, and brands
      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);
      const categories = await databaseService.getAll(STORAGE_KEYS.CATEGORIES);
      const brands = await databaseService.getAll(STORAGE_KEYS.BRANDS);

      logInfo(LOG_CATEGORIES.PRODUCTS, 'getProducts_data_loaded', {
        productCount: products.length,
        categoryCount: categories.length,
        brandCount: brands.length,
        categories: categories.map(c => ({ id: c.id, name: c.name }))
      });

      // Filter active products
      let filteredProducts = products.filter(p => p.is_active !== 0);

      // Apply search filter
      if (search) {
        const searchTerm = search.toLowerCase();
        filteredProducts = filteredProducts.filter(p =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.code.toLowerCase().includes(searchTerm) ||
          (p.barcode && p.barcode.toLowerCase().includes(searchTerm))
        );
      }

      // Apply category filter
      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.category_id === categoryId);
      }

      // Apply brand filter
      if (brandId) {
        filteredProducts = filteredProducts.filter(p => p.brand_id === brandId);
      }

      // Sort by name
      filteredProducts.sort((a, b) => a.name.localeCompare(b.name));

      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(offset, offset + limit);

      // Transform data to match API format
      const transformedProducts = paginatedProducts.map(product => {
        const category = product.category_id ? categories.find(c => c.id === product.category_id) : null;
        const brand = product.brand_id ? brands.find(b => b.id === product.brand_id) : null;

        const transformed = {
          id: product.id,
          name: product.name,
          code: product.code,
          barcode: product.barcode,
          price: product.price,
          cost: product.cost,
          stock_quantity: product.stock_quantity,
          min_stock: product.min_stock,
          description: product.description,
          image_url: product.image_url,
          category: category,
          brand: brand,
          created_at: product.created_at
        };

        logInfo(LOG_CATEGORIES.PRODUCTS, 'product_transformed', {
          productId: product.id,
          productName: product.name,
          categoryId: product.category_id,
          categoryName: category?.name,
          brandId: product.brand_id,
          brandName: brand?.name
        });

        return transformed;
      });

      return {
        data: transformedProducts,
        meta: {
          current_page: page,
          last_page: Math.ceil(filteredProducts.length / limit) || 1,
          total: filteredProducts.length,
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch products: ' + error.message);
    }
  },



  // Get all categories
  getCategories: async () => {
    try {
      const categories = await databaseService.getAll(STORAGE_KEYS.CATEGORIES);
      return categories.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error('Failed to fetch categories: ' + error.message);
    }
  },

  // Get all brands
  getBrands: async () => {
    try {
      const brands = await databaseService.getAll(STORAGE_KEYS.BRANDS);
      return brands.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error('Failed to fetch brands: ' + error.message);
    }
  },

  // Add new product
  addProduct: async (productData) => {
    try {
      const result = await databaseService.insert(STORAGE_KEYS.PRODUCTS, productData);
      return result;
    } catch (error) {
      throw new Error('Failed to add product: ' + error.message);
    }
  },

  // Update product
  updateProduct: async (id, productData) => {
    try {
      const result = await databaseService.update(STORAGE_KEYS.PRODUCTS, productData, 'id', id);
      return result;
    } catch (error) {
      throw new Error('Failed to update product: ' + error.message);
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      await databaseService.update(STORAGE_KEYS.PRODUCTS, { is_active: 0 }, 'id', id);
      return true;
    } catch (error) {
      throw new Error('Failed to delete product: ' + error.message);
    }
  },

  // Update stock quantity
  updateStock: async (productId, quantity) => {
    try {
      await databaseService.update(STORAGE_KEYS.PRODUCTS, { stock_quantity: quantity }, 'id', productId);
      return true;
    } catch (error) {
      throw new Error('Failed to update stock: ' + error.message);
    }
  },

  // Reduce stock after sale
  reduceStock: async (productId, quantity) => {
    try {
      const product = await databaseService.getById(STORAGE_KEYS.PRODUCTS, productId);
      if (product) {
        const newQuantity = Math.max(0, product.stock_quantity - quantity);
        await databaseService.update(STORAGE_KEYS.PRODUCTS, { stock_quantity: newQuantity }, 'id', productId);
      }
      return true;
    } catch (error) {
      throw new Error('Failed to reduce stock: ' + error.message);
    }
  }
};
