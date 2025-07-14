import databaseService, { STORAGE_KEYS } from './databaseService';
import { localProductService } from './localProductService';
import { logInfo, logError, LOG_CATEGORIES } from '../utils/debugLogger';

export const localPosService = {
  // Create new sale
  createSale: async (saleData) => {
    try {
      console.log('🔄 [localPosService] Creating sale...', saleData);

      // Validate required fields
      if (!saleData.sale_items || saleData.sale_items.length === 0) {
        throw new Error('Sale must contain at least one item');
      }

      if (!saleData.grand_total || saleData.grand_total <= 0) {
        throw new Error('Sale total must be greater than zero');
      }

      // Validate stock availability for all items before processing
      console.log('🔍 [localPosService] Validating stock availability...');
      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);

      for (const item of saleData.sale_items) {
        const product = products.find(p => p.id === item.product_id);
        if (!product) {
          throw new Error(`Product with ID ${item.product_id} not found`);
        }

        if (product.stock_quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.stock_quantity}, Requested: ${item.quantity}`);
        }

        console.log('✅ [localPosService] Stock validated for product:', {
          productId: product.id,
          productName: product.name,
          available: product.stock_quantity,
          requested: item.quantity
        });
      }

      // Calculate change amount properly
      const receivedAmount = saleData.received_amount || saleData.grand_total;
      const changeAmount = Math.max(0, receivedAmount - saleData.grand_total);

      // Create sale record
      console.log('💾 [localPosService] Creating sale record...');
      const sale = await databaseService.insert(STORAGE_KEYS.SALES, {
        customer_id: saleData.customer_id,
        subtotal: saleData.subtotal || 0,
        discount: saleData.discount || 0,
        tax_rate: saleData.tax_rate || 0,
        tax_amount: saleData.tax_amount || 0,
        shipping: saleData.shipping || 0,
        grand_total: saleData.grand_total,
        received_amount: receivedAmount,
        change_amount: changeAmount,
        payment_type: saleData.payment_type || 'cash',
        payment_status: saleData.payment_status || 1,
        status: saleData.status || 1,
        note: saleData.note || ''
      });

      console.log('✅ [localPosService] Sale record created:', { saleId: sale.id });

      // Create sale items
      console.log('💾 [localPosService] Creating sale items...');
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

        console.log('✅ [localPosService] Sale item created:', {
          saleItemId: saleItem.id,
          productId: item.product_id,
          quantity: item.quantity
        });

        // Reduce product stock
        console.log('📦 [localPosService] Reducing stock for product:', item.product_id);
        await localProductService.reduceStock(item.product_id, item.quantity);
      }

      console.log('✅ [localPosService] All sale items created and stock updated');

      // Get the complete sale with items
      console.log('🔍 [localPosService] Fetching complete sale data...');
      const completeSale = await localPosService.getSale(sale.id);

      console.log('✅ [localPosService] Sale created successfully:', {
        saleId: completeSale.id,
        itemCount: completeSale.sale_items?.length || 0,
        total: completeSale.grand_total
      });

      return completeSale;
    } catch (error) {
      console.error('❌ [localPosService] Failed to create sale:', error);
      throw new Error('Failed to create sale: ' + error.message);
    }
  },

  // Get sale by ID with items
  getSale: async (id) => {
    try {
      logInfo(LOG_CATEGORIES.SALES, 'getSale_start', { saleId: id });

      // Get sale
      const sale = await databaseService.getById(STORAGE_KEYS.SALES, id);
      if (!sale) {
        logError(LOG_CATEGORIES.SALES, 'getSale_not_found', { saleId: id });
        throw new Error('Sale not found');
      }

      logInfo(LOG_CATEGORIES.SALES, 'getSale_found', { saleId: id, sale });

      // Get customer if exists
      let customer = null;
      if (sale.customer_id) {
        customer = await databaseService.getById(STORAGE_KEYS.CUSTOMERS, sale.customer_id);
        logInfo(LOG_CATEGORIES.SALES, 'getSale_customer_loaded', {
          customerId: sale.customer_id,
          customerFound: !!customer
        });
      }

      // Get sale items
      const allSaleItems = await databaseService.getAll(STORAGE_KEYS.SALE_ITEMS);
      const saleItems = allSaleItems.filter(item => item.sale_id === id);

      logInfo(LOG_CATEGORIES.SALES, 'getSale_items_loaded', {
        saleId: id,
        itemCount: saleItems.length
      });

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

      const completeSale = {
        ...sale,
        customer,
        sale_items: itemsWithProducts
      };

      logInfo(LOG_CATEGORIES.SALES, 'getSale_success', {
        saleId: id,
        itemCount: itemsWithProducts.length,
        hasCustomer: !!customer
      });

      return completeSale;
    } catch (error) {
      logError(LOG_CATEGORIES.SALES, 'getSale_failed', { saleId: id }, error);
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
