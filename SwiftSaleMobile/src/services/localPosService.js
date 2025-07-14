import databaseService, { STORAGE_KEYS } from './databaseService';
import { localProductService } from './localProductService';

export const localPosService = {
  // Create new sale
  createSale: async (saleData) => {
    try {
      // Create sale record
      const sale = await databaseService.insert(STORAGE_KEYS.SALES, {
        customer_id: saleData.customer_id,
        subtotal: saleData.subtotal || 0,
        discount: saleData.discount || 0,
        tax_rate: saleData.tax_rate || 0,
        tax_amount: saleData.tax_amount || 0,
        grand_total: saleData.grand_total,
        received_amount: saleData.received_amount || saleData.grand_total,
        change_amount: (saleData.received_amount || saleData.grand_total) - saleData.grand_total,
        payment_type: saleData.payment_type || 'cash',
        payment_status: saleData.payment_status || 1,
        status: saleData.status || 1,
        note: saleData.note || ''
      });

      // Create sale items
      const saleItems = [];
      for (const item of saleData.sale_items) {
        const saleItem = await databaseService.insert(STORAGE_KEYS.SALE_ITEMS, {
          sale_id: sale.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
          total: item.total
        });
        saleItems.push(saleItem);

        // Reduce product stock
        await localProductService.reduceStock(item.product_id, item.quantity);
      }

      // Get the complete sale with items
      const completeSale = await this.getSale(sale.id);
      return completeSale;
    } catch (error) {
      throw new Error('Failed to create sale: ' + error.message);
    }
  },

  // Get sale by ID with items
  getSale: async (id) => {
    try {
      // Get sale
      const sale = await databaseService.getById(STORAGE_KEYS.SALES, id);
      if (!sale) {
        throw new Error('Sale not found');
      }

      // Get customer if exists
      let customer = null;
      if (sale.customer_id) {
        customer = await databaseService.getById(STORAGE_KEYS.CUSTOMERS, sale.customer_id);
      }

      // Get sale items
      const allSaleItems = await databaseService.getAll(STORAGE_KEYS.SALE_ITEMS);
      const saleItems = allSaleItems.filter(item => item.sale_id === id);

      // Get product details for each item
      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);
      const itemsWithProducts = saleItems.map(item => {
        const product = products.find(p => p.id === item.product_id);
        return {
          ...item,
          product: product ? {
            id: product.id,
            name: product.name,
            code: product.code
          } : null
        };
      });

      return {
        ...sale,
        customer,
        sale_items: itemsWithProducts
      };
    } catch (error) {
      throw new Error('Failed to fetch sale: ' + error.message);
    }
  },

  // Get all sales
  getSales: async ({ page = 1, startDate = null, endDate = null, limit = 20 }) => {
    try {
      let sales = await databaseService.getAll(STORAGE_KEYS.SALES);
      const customers = await databaseService.getAll(STORAGE_KEYS.CUSTOMERS);
      const allSaleItems = await databaseService.getAll(STORAGE_KEYS.SALE_ITEMS);

      // Apply date filters
      if (startDate || endDate) {
        sales = sales.filter(sale => {
          const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
          if (startDate && saleDate < startDate) return false;
          if (endDate && saleDate > endDate) return false;
          return true;
        });
      }

      // Sort by date (newest first)
      sales.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      // Apply pagination
      const offset = (page - 1) * limit;
      const paginatedSales = sales.slice(offset, offset + limit);

      // Add customer and item count info
      const salesWithDetails = paginatedSales.map(sale => {
        const customer = sale.customer_id ? 
          customers.find(c => c.id === sale.customer_id) : null;
        
        const saleItemsCount = allSaleItems.filter(item => item.sale_id === sale.id).length;

        return {
          ...sale,
          customer,
          sale_items: [{ count: saleItemsCount }]
        };
      });

      return {
        data: salesWithDetails,
        meta: {
          current_page: page,
          last_page: Math.ceil(sales.length / limit) || 1,
          total: sales.length,
        }
      };
    } catch (error) {
      throw new Error('Failed to fetch sales: ' + error.message);
    }
  },

  // Get dashboard statistics
  getDashboardStats: async () => {
    try {
      const sales = await databaseService.getAll(STORAGE_KEYS.SALES);
      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);
      
      const today = new Date().toISOString().split('T')[0];
      
      // Today's sales
      const todaySales = sales
        .filter(sale => {
          const saleDate = new Date(sale.created_at).toISOString().split('T')[0];
          return saleDate === today && sale.status === 1;
        })
        .reduce((sum, sale) => sum + sale.grand_total, 0);
      
      // Total revenue
      const totalRevenue = sales
        .filter(sale => sale.status === 1)
        .reduce((sum, sale) => sum + sale.grand_total, 0);
      
      // Total sales count
      const totalSales = sales.filter(sale => sale.status === 1).length;
      
      // Low stock products
      const lowStockProducts = products.filter(product => 
        product.is_active !== 0 && 
        product.stock_quantity <= product.min_stock
      ).length;
      
      return {
        todaySales,
        totalRevenue,
        totalSales,
        lowStockProducts
      };
    } catch (error) {
      throw new Error('Failed to fetch dashboard stats: ' + error.message);
    }
  }
};
