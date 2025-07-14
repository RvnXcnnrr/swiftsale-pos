import databaseService, { STORAGE_KEYS } from './databaseService';
import { localAuthService } from './localAuthService';
import { logInfo, logError, LOG_CATEGORIES } from '../utils/debugLogger';

export const dataInitService = {
  // Initialize app with sample data
  initializeData: async () => {
    try {
      logInfo(LOG_CATEGORIES.INIT, 'initializeData_start', {});

      // Check if data already exists
      const existingProducts = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);

      if (existingProducts.length > 0) {
        logInfo(LOG_CATEGORIES.INIT, 'initializeData_already_initialized', { productCount: existingProducts.length });
        return;
      }

      logInfo(LOG_CATEGORIES.INIT, 'initializeData_starting_initialization', {});

      // Create default admin user
      await localAuthService.createDefaultUser();
      logInfo(LOG_CATEGORIES.INIT, 'initializeData_admin_user_created', {});

      // Insert categories
      const categories = [
        { name: 'Electronics', description: 'Electronic devices and gadgets' },
        { name: 'Computers', description: 'Computers and accessories' },
        { name: 'Accessories', description: 'Various accessories' },
        { name: 'Home & Garden', description: 'Home and garden items' },
        { name: 'Clothing', description: 'Clothing and apparel' },
      ];

      const categoryIds = {};
      for (const category of categories) {
        const result = await databaseService.insert(STORAGE_KEYS.CATEGORIES, category);
        categoryIds[category.name] = result.id;
      }

      // Insert brands
      const brands = [
        { name: 'Apple', description: 'Apple Inc.' },
        { name: 'Samsung', description: 'Samsung Electronics' },
        { name: 'Dell', description: 'Dell Technologies' },
        { name: 'HP', description: 'HP Inc.' },
        { name: 'Sony', description: 'Sony Corporation' },
      ];

      const brandIds = {};
      for (const brand of brands) {
        const result = await databaseService.insert(STORAGE_KEYS.BRANDS, brand);
        brandIds[brand.name] = result.id;
      }

      // Insert products
      const products = [
        {
          name: 'iPhone 14 Pro',
          code: 'IPH14PRO',
          barcode: '1234567890123',
          price: 999.99,
          cost: 750.00,
          stock_quantity: 25,
          min_stock: 5,
          category_id: categoryIds['Electronics'],
          brand_id: brandIds['Apple'],
          description: 'Latest iPhone with Pro features',
          image_url: 'https://via.placeholder.com/150x150?text=iPhone+14+Pro',
        },
        {
          name: 'Samsung Galaxy S23',
          code: 'SGS23',
          barcode: '2345678901234',
          price: 799.99,
          cost: 600.00,
          stock_quantity: 30,
          min_stock: 5,
          category_id: categoryIds['Electronics'],
          brand_id: brandIds['Samsung'],
          description: 'Samsung flagship smartphone',
          image_url: 'https://via.placeholder.com/150x150?text=Galaxy+S23',
        },
        {
          name: 'MacBook Air M2',
          code: 'MBAM2',
          barcode: '3456789012345',
          price: 1199.99,
          cost: 900.00,
          stock_quantity: 15,
          min_stock: 3,
          category_id: categoryIds['Computers'],
          brand_id: brandIds['Apple'],
          description: 'Apple MacBook Air with M2 chip',
          image_url: 'https://via.placeholder.com/150x150?text=MacBook+Air',
        },
        {
          name: 'AirPods Pro',
          code: 'APPRO',
          barcode: '4567890123456',
          price: 249.99,
          cost: 180.00,
          stock_quantity: 50,
          min_stock: 10,
          category_id: categoryIds['Accessories'],
          brand_id: brandIds['Apple'],
          description: 'Apple AirPods Pro with noise cancellation',
          image_url: 'https://via.placeholder.com/150x150?text=AirPods+Pro',
        },
        {
          name: 'Dell XPS 13',
          code: 'DXPS13',
          barcode: '5678901234567',
          price: 899.99,
          cost: 650.00,
          stock_quantity: 20,
          min_stock: 5,
          category_id: categoryIds['Computers'],
          brand_id: brandIds['Dell'],
          description: 'Dell XPS 13 ultrabook',
          image_url: 'https://via.placeholder.com/150x150?text=Dell+XPS+13',
        },
        {
          name: 'Samsung Galaxy Buds',
          code: 'SGB',
          barcode: '6789012345678',
          price: 149.99,
          cost: 100.00,
          stock_quantity: 40,
          min_stock: 8,
          category_id: categoryIds['Accessories'],
          brand_id: brandIds['Samsung'],
          description: 'Samsung wireless earbuds',
          image_url: 'https://via.placeholder.com/150x150?text=Galaxy+Buds',
        },
        {
          name: 'HP Pavilion Laptop',
          code: 'HPP15',
          barcode: '7890123456789',
          price: 649.99,
          cost: 450.00,
          stock_quantity: 18,
          min_stock: 5,
          category_id: categoryIds['Computers'],
          brand_id: brandIds['HP'],
          description: 'HP Pavilion 15 inch laptop',
          image_url: 'https://via.placeholder.com/150x150?text=HP+Pavilion',
        },
        {
          name: 'Sony WH-1000XM4',
          code: 'SWXM4',
          barcode: '8901234567890',
          price: 349.99,
          cost: 250.00,
          stock_quantity: 12,
          min_stock: 3,
          category_id: categoryIds['Accessories'],
          brand_id: brandIds['Sony'],
          description: 'Sony noise cancelling headphones',
          image_url: 'https://via.placeholder.com/150x150?text=Sony+WH1000XM4',
        },
        {
          name: 'Apple Watch Series 8',
          code: 'AWS8',
          barcode: '9012345678901',
          price: 399.99,
          cost: 300.00,
          stock_quantity: 22,
          min_stock: 5,
          category_id: categoryIds['Electronics'],
          brand_id: brandIds['Apple'],
          description: 'Apple Watch Series 8 smartwatch',
          image_url: 'https://via.placeholder.com/150x150?text=Apple+Watch',
        },
        {
          name: 'Samsung 4K Monitor',
          code: 'S4KM',
          barcode: '0123456789012',
          price: 299.99,
          cost: 200.00,
          stock_quantity: 8,
          min_stock: 2,
          category_id: categoryIds['Computers'],
          brand_id: brandIds['Samsung'],
          description: '27 inch 4K monitor',
          image_url: 'https://via.placeholder.com/150x150?text=4K+Monitor',
        },
      ];

      for (const product of products) {
        await databaseService.insert(STORAGE_KEYS.PRODUCTS, product);
      }

      // Insert sample customers
      const customers = [
        {
          name: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          address: '123 Main St, City, State 12345',
        },
        {
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          address: '456 Oak Ave, City, State 12345',
        },
        {
          name: 'Bob Johnson',
          email: 'bob.johnson@example.com',
          phone: '+1 (555) 456-7890',
          address: '789 Pine St, City, State 12345',
        },
        {
          name: 'Alice Brown',
          email: 'alice.brown@example.com',
          phone: '+1 (555) 321-0987',
          address: '321 Elm St, City, State 12345',
        },
        {
          name: 'Charlie Wilson',
          email: 'charlie.wilson@example.com',
          phone: '+1 (555) 654-3210',
          address: '654 Maple Ave, City, State 12345',
        },
      ];

      for (const customer of customers) {
        await databaseService.insert(STORAGE_KEYS.CUSTOMERS, customer);
      }

      // Insert app settings
      const settings = [
        { key: 'app_name', value: 'SwiftSale Mobile' },
        { key: 'currency', value: 'USD' },
        { key: 'tax_rate', value: '8.5' },
        { key: 'receipt_footer', value: 'Thank you for your business!' },
      ];

      for (const setting of settings) {
        await databaseService.insert(STORAGE_KEYS.SETTINGS, setting);
      }

      logInfo(LOG_CATEGORIES.INIT, 'initializeData_complete', { message: 'Sample data initialized successfully!' });
    } catch (error) {
      logError(LOG_CATEGORIES.INIT, 'initializeData_failed', {}, error);
      throw error;
    }
  },

  // Reset all data
  resetData: async () => {
    try {
      logInfo(LOG_CATEGORIES.INIT, 'resetData_start', {});
      await databaseService.clearAllData();
      await this.initializeData();
      logInfo(LOG_CATEGORIES.INIT, 'resetData_complete', { message: 'Data reset successfully!' });
    } catch (error) {
      logError(LOG_CATEGORIES.INIT, 'resetData_failed', {}, error);
      throw error;
    }
  }
};
