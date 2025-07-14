import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { localPosService } from '../../services/localPosService';

// Async thunks
export const processSale = createAsyncThunk(
  'pos/processSale',
  async (saleData, { rejectWithValue }) => {
    try {
      const response = await localPosService.createSale(saleData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to process sale');
    }
  }
);

export const fetchSales = createAsyncThunk(
  'pos/fetchSales',
  async ({ page = 1, startDate = null, endDate = null }, { rejectWithValue }) => {
    try {
      const response = await localPosService.getSales({ page, startDate, endDate });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch sales');
    }
  }
);

export const fetchDashboardStats = createAsyncThunk(
  'pos/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localPosService.getDashboardStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch dashboard stats');
    }
  }
);

const initialState = {
  sales: [],
  currentSale: null,
  dashboardStats: {
    todaySales: 0,
    totalRevenue: 0,
    totalSales: 0,
    lowStockProducts: 0,
  },
  isLoading: false,
  isProcessing: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  },
};

const posSlice = createSlice({
  name: 'pos',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentSale: (state, action) => {
      state.currentSale = action.payload;
    },
    clearCurrentSale: (state) => {
      state.currentSale = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Process sale
      .addCase(processSale.pending, (state) => {
        state.isProcessing = true;
        state.error = null;
      })
      .addCase(processSale.fulfilled, (state, action) => {
        state.isProcessing = false;
        state.currentSale = action.payload;
        state.sales.unshift(action.payload);
      })
      .addCase(processSale.rejected, (state, action) => {
        state.isProcessing = false;
        state.error = action.payload;
      })
      // Fetch sales
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const { data, meta } = action.payload;
        
        if (action.meta.arg.page === 1) {
          state.sales = data;
        } else {
          state.sales = [...state.sales, ...data];
        }
        
        state.pagination = {
          currentPage: meta.current_page,
          totalPages: meta.last_page,
          totalItems: meta.total,
          hasMore: meta.current_page < meta.last_page,
        };
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch dashboard stats
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStats = action.payload;
      });
  },
});

export const {
  clearError,
  setCurrentSale,
  clearCurrentSale,
} = posSlice.actions;

export default posSlice.reducer;
