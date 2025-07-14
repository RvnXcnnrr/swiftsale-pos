import databaseService, { STORAGE_KEYS } from './databaseService';

export const localCustomerService = {
  // Get all customers
  getCustomers: async ({ search = '' }) => {
    try {
      let customers = await databaseService.getAll(STORAGE_KEYS.CUSTOMERS);

      if (search) {
        const searchTerm = search.toLowerCase();
        customers = customers.filter(customer =>
          customer.name.toLowerCase().includes(searchTerm) ||
          (customer.email && customer.email.toLowerCase().includes(searchTerm)) ||
          (customer.phone && customer.phone.toLowerCase().includes(searchTerm))
        );
      }

      return customers.sort((a, b) => a.name.localeCompare(b.name));
    } catch (error) {
      throw new Error('Failed to fetch customers: ' + error.message);
    }
  },

  // Get customer by ID
  getCustomer: async (id) => {
    try {
      const customer = await databaseService.getById(STORAGE_KEYS.CUSTOMERS, id);
      if (!customer) {
        throw new Error('Customer not found');
      }
      return customer;
    } catch (error) {
      throw new Error('Failed to fetch customer: ' + error.message);
    }
  },

  // Create new customer
  createCustomer: async (customerData) => {
    try {
      const result = await databaseService.insert(STORAGE_KEYS.CUSTOMERS, customerData);
      return result;
    } catch (error) {
      throw new Error('Failed to create customer: ' + error.message);
    }
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    try {
      const result = await databaseService.update(STORAGE_KEYS.CUSTOMERS, customerData, 'id', id);
      return result;
    } catch (error) {
      throw new Error('Failed to update customer: ' + error.message);
    }
  },

  // Delete customer
  deleteCustomer: async (id) => {
    try {
      await databaseService.delete(STORAGE_KEYS.CUSTOMERS, 'id', id);
      return true;
    } catch (error) {
      throw new Error('Failed to delete customer: ' + error.message);
    }
  }
};
