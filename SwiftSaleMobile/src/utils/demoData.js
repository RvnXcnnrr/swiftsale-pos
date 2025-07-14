// Demo data for testing when backend is not available

export const demoProducts = [
  {
    id: 1,
    name: 'iPhone 14 Pro',
    code: 'IPH14PRO',
    price: 999.99,
    stock_quantity: 25,
    category: { id: 1, name: 'Electronics' },
    brand: { id: 1, name: 'Apple' },
    image_url: 'https://via.placeholder.com/150x150?text=iPhone+14+Pro',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23',
    code: 'SGS23',
    price: 799.99,
    stock_quantity: 30,
    category: { id: 1, name: 'Electronics' },
    brand: { id: 2, name: 'Samsung' },
    image_url: 'https://via.placeholder.com/150x150?text=Galaxy+S23',
  },
  {
    id: 3,
    name: 'MacBook Air M2',
    code: 'MBAM2',
    price: 1199.99,
    stock_quantity: 15,
    category: { id: 2, name: 'Computers' },
    brand: { id: 1, name: 'Apple' },
    image_url: 'https://via.placeholder.com/150x150?text=MacBook+Air',
  },
  {
    id: 4,
    name: 'AirPods Pro',
    code: 'APPRO',
    price: 249.99,
    stock_quantity: 50,
    category: { id: 3, name: 'Accessories' },
    brand: { id: 1, name: 'Apple' },
    image_url: 'https://via.placeholder.com/150x150?text=AirPods+Pro',
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    code: 'DXPS13',
    price: 899.99,
    stock_quantity: 20,
    category: { id: 2, name: 'Computers' },
    brand: { id: 3, name: 'Dell' },
    image_url: 'https://via.placeholder.com/150x150?text=Dell+XPS+13',
  },
];

export const demoCategories = [
  { id: 1, name: 'Electronics' },
  { id: 2, name: 'Computers' },
  { id: 3, name: 'Accessories' },
  { id: 4, name: 'Home & Garden' },
  { id: 5, name: 'Clothing' },
];

export const demoBrands = [
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Samsung' },
  { id: 3, name: 'Dell' },
  { id: 4, name: 'HP' },
  { id: 5, name: 'Sony' },
];

export const demoCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 987-6543',
  },
  {
    id: 3,
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 (555) 456-7890',
  },
];

export const demoSales = [
  {
    id: 1,
    grand_total: 1249.98,
    status: 1,
    payment_status: 1,
    payment_type: 'cash',
    created_at: new Date().toISOString(),
    customer: demoCustomers[0],
    sale_items: [
      {
        id: 1,
        product: demoProducts[0],
        quantity: 1,
        price: 999.99,
        total: 999.99,
      },
      {
        id: 2,
        product: demoProducts[3],
        quantity: 1,
        price: 249.99,
        total: 249.99,
      },
    ],
  },
  {
    id: 2,
    grand_total: 799.99,
    status: 1,
    payment_status: 1,
    payment_type: 'card',
    created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    customer: demoCustomers[1],
    sale_items: [
      {
        id: 3,
        product: demoProducts[1],
        quantity: 1,
        price: 799.99,
        total: 799.99,
      },
    ],
  },
];

export const demoDashboardStats = {
  todaySales: 2049.97,
  totalRevenue: 15750.50,
  totalSales: 25,
  lowStockProducts: 3,
};

// Helper function to simulate API delay
export const simulateApiDelay = (data, delay = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: data,
        meta: {
          current_page: 1,
          last_page: 1,
          total: Array.isArray(data) ? data.length : 1,
        },
      });
    }, delay);
  });
};

// Demo mode flag - set to true to use demo data instead of API
export const DEMO_MODE = false; // Change to true for demo mode
