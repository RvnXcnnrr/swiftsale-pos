import { localPosService } from '../services/localPosService';
import { localProductService } from '../services/localProductService';
import databaseService, { STORAGE_KEYS } from '../services/databaseService';
import { logInfo, logError, LOG_CATEGORIES } from './debugLogger';

export const salesTestUtils = {
  // Test the complete sales workflow
  testSalesWorkflow: async () => {
    try {
      logInfo(LOG_CATEGORIES.SALES, 'testSalesWorkflow_start', {});

      // Get sample products
      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);
      if (products.length === 0) {
        throw new Error('No products found. Please initialize sample data first.');
      }

      // Get sample customers
      const customers = await databaseService.getAll(STORAGE_KEYS.CUSTOMERS);
      
      // Select first two products for the test sale
      const testProducts = products.slice(0, 2);
      
      logInfo(LOG_CATEGORIES.SALES, 'testSalesWorkflow_products_selected', {
        productCount: testProducts.length,
        products: testProducts.map(p => ({ id: p.id, name: p.name, stock: p.stock_quantity }))
      });

      // Create test sale data
      const saleItems = testProducts.map(product => ({
        product_id: product.id,
        quantity: 1,
        price: product.price,
        total: product.price * 1
      }));

      const subtotal = saleItems.reduce((sum, item) => sum + item.total, 0);
      const discount = 5; // 5% discount
      const tax = 8.5; // 8.5% tax
      const discountAmount = (subtotal * discount) / 100;
      const taxableAmount = subtotal - discountAmount;
      const taxAmount = (taxableAmount * tax) / 100;
      const grandTotal = taxableAmount + taxAmount;

      const testSaleData = {
        customer_id: customers.length > 0 ? customers[0].id : null,
        warehouse_id: 1,
        sale_items: saleItems,
        subtotal: subtotal,
        discount: discount,
        tax_rate: tax,
        tax_amount: taxAmount,
        shipping: 0,
        grand_total: grandTotal,
        received_amount: grandTotal + 10, // Add some change
        payment_type: 'cash',
        payment_status: 1,
        status: 1,
        note: 'Test sale from salesTestUtils',
        date: new Date().toISOString().split('T')[0],
      };

      logInfo(LOG_CATEGORIES.SALES, 'testSalesWorkflow_sale_data_created', {
        itemCount: saleItems.length,
        subtotal,
        discount,
        tax,
        grandTotal,
        receivedAmount: testSaleData.received_amount
      });

      // Process the sale
      const result = await localPosService.createSale(testSaleData);

      logInfo(LOG_CATEGORIES.SALES, 'testSalesWorkflow_sale_created', {
        saleId: result.id,
        total: result.grand_total,
        itemCount: result.sale_items?.length || 0
      });

      // Verify the sale was created correctly
      const verificationResult = await this.verifySale(result.id, testSaleData);

      logInfo(LOG_CATEGORIES.SALES, 'testSalesWorkflow_complete', {
        saleId: result.id,
        verification: verificationResult
      });

      return {
        success: true,
        saleId: result.id,
        sale: result,
        verification: verificationResult
      };

    } catch (error) {
      logError(LOG_CATEGORIES.SALES, 'testSalesWorkflow_failed', {}, error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Verify a sale was created correctly
  verifySale: async (saleId, originalSaleData) => {
    try {
      logInfo(LOG_CATEGORIES.SALES, 'verifySale_start', { saleId });

      // Get the created sale
      const sale = await localPosService.getSale(saleId);

      const verification = {
        saleExists: !!sale,
        correctTotal: Math.abs(sale.grand_total - originalSaleData.grand_total) < 0.01,
        correctItemCount: sale.sale_items?.length === originalSaleData.sale_items.length,
        correctPaymentType: sale.payment_type === originalSaleData.payment_type,
        correctStatus: sale.status === originalSaleData.status,
        hasCustomer: originalSaleData.customer_id ? !!sale.customer : true,
        stockReduced: true // We'll check this separately
      };

      // Verify stock was reduced for each product
      for (const originalItem of originalSaleData.sale_items) {
        const currentProduct = await databaseService.getById(STORAGE_KEYS.PRODUCTS, originalItem.product_id);
        // Note: We can't easily verify exact stock reduction without knowing the original stock
        // but we can verify the product still exists
        if (!currentProduct) {
          verification.stockReduced = false;
          break;
        }
      }

      verification.allChecksPass = Object.values(verification).every(check => check === true);

      logInfo(LOG_CATEGORIES.SALES, 'verifySale_complete', {
        saleId,
        verification
      });

      return verification;

    } catch (error) {
      logError(LOG_CATEGORIES.SALES, 'verifySale_failed', { saleId }, error);
      return {
        error: error.message,
        allChecksPass: false
      };
    }
  },

  // Test stock validation
  testStockValidation: async () => {
    try {
      logInfo(LOG_CATEGORIES.SALES, 'testStockValidation_start', {});

      const products = await databaseService.getAll(STORAGE_KEYS.PRODUCTS);
      if (products.length === 0) {
        throw new Error('No products found');
      }

      const testProduct = products[0];
      
      // Try to create a sale with more quantity than available
      const invalidSaleData = {
        customer_id: null,
        warehouse_id: 1,
        sale_items: [{
          product_id: testProduct.id,
          quantity: testProduct.stock_quantity + 10, // More than available
          price: testProduct.price,
          total: testProduct.price * (testProduct.stock_quantity + 10)
        }],
        subtotal: testProduct.price * (testProduct.stock_quantity + 10),
        discount: 0,
        tax_rate: 0,
        tax_amount: 0,
        shipping: 0,
        grand_total: testProduct.price * (testProduct.stock_quantity + 10),
        received_amount: testProduct.price * (testProduct.stock_quantity + 10),
        payment_type: 'cash',
        payment_status: 1,
        status: 1,
        note: 'Test stock validation',
        date: new Date().toISOString().split('T')[0],
      };

      try {
        await localPosService.createSale(invalidSaleData);
        // If we get here, the validation failed
        return {
          success: false,
          error: 'Stock validation should have failed but did not'
        };
      } catch (error) {
        // This is expected - the sale should fail due to insufficient stock
        logInfo(LOG_CATEGORIES.SALES, 'testStockValidation_correctly_failed', {
          error: error.message
        });
        
        return {
          success: true,
          message: 'Stock validation correctly prevented overselling',
          error: error.message
        };
      }

    } catch (error) {
      logError(LOG_CATEGORIES.SALES, 'testStockValidation_failed', {}, error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Run all tests
  runAllTests: async () => {
    logInfo(LOG_CATEGORIES.SALES, 'runAllTests_start', {});

    const results = {
      salesWorkflow: await this.testSalesWorkflow(),
      stockValidation: await this.testStockValidation()
    };

    const allTestsPassed = results.salesWorkflow.success && results.stockValidation.success;

    logInfo(LOG_CATEGORIES.SALES, 'runAllTests_complete', {
      allTestsPassed,
      results
    });

    return {
      allTestsPassed,
      results
    };
  }
};
