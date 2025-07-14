import { createSlice } from '@reduxjs/toolkit';
import { logInfo, logError, LOG_CATEGORIES } from '../../utils/debugLogger';

const initialState = {
  items: [],
  customer: null,
  discount: 0,
  tax: 0,
  shipping: 0,
  subtotal: 0,
  total: 0,
  paymentMethod: null,
  notes: '',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find(item => item.id === product.id);

      logInfo(LOG_CATEGORIES.POS, 'addToCart', {
        productId: product.id,
        productName: product.name,
        existingQuantity: existingItem?.quantity || 0,
        stockQuantity: product.stock_quantity
      });

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = existingItem.quantity * existingItem.price;
        logInfo(LOG_CATEGORIES.POS, 'addToCart_updated_existing', {
          productId: product.id,
          newQuantity: existingItem.quantity,
          newTotal: existingItem.total
        });
      } else {
        state.items.push({
          ...product,
          quantity: 1,
          total: product.price,
        });
        logInfo(LOG_CATEGORIES.POS, 'addToCart_added_new', {
          productId: product.id,
          quantity: 1,
          total: product.price
        });
      }

      cartSlice.caseReducers.calculateTotals(state);
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.id !== productId);
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== productId);
        } else {
          item.quantity = quantity;
          item.total = item.quantity * item.price;
        }
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    
    setDiscount: (state, action) => {
      state.discount = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    setTax: (state, action) => {
      state.tax = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    setShipping: (state, action) => {
      state.shipping = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    
    setPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
    },
    
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    
    clearCart: (state) => {
      return initialState;
    },
    
    calculateTotals: (state) => {
      const previousSubtotal = state.subtotal;
      const previousTotal = state.total;

      state.subtotal = state.items.reduce((sum, item) => sum + item.total, 0);

      const discountAmount = (state.subtotal * state.discount) / 100;
      const taxAmount = ((state.subtotal - discountAmount) * state.tax) / 100;

      state.total = state.subtotal - discountAmount + taxAmount + state.shipping;

      logInfo(LOG_CATEGORIES.POS, 'calculateTotals', {
        itemCount: state.items.length,
        subtotal: state.subtotal,
        discount: state.discount,
        discountAmount,
        tax: state.tax,
        taxAmount,
        shipping: state.shipping,
        total: state.total,
        changed: previousSubtotal !== state.subtotal || previousTotal !== state.total
      });
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  setCustomer,
  setDiscount,
  setTax,
  setShipping,
  setPaymentMethod,
  setNotes,
  clearCart,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;
