import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { localProductService } from '../../services/localProductService';

// Async thunks
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, search = '', categoryId = null, brandId = null }, { rejectWithValue }) => {
    try {
      const response = await localProductService.getProducts({
        page,
        search,
        categoryId,
        brandId,
      });
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch products');
    }
  }
);



export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localProductService.getCategories();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch categories');
    }
  }
);

export const fetchBrands = createAsyncThunk(
  'products/fetchBrands',
  async (_, { rejectWithValue }) => {
    try {
      const response = await localProductService.getBrands();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch brands');
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  brands: [],
  currentProduct: null,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasMore: false,
  },
  filters: {
    search: '',
    categoryId: null,
    brandId: null,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        categoryId: null,
        brandId: null,
      };
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    clearProducts: (state) => {
      state.products = [];
      state.pagination = {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasMore: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state, action) => {
        if (action.meta.arg.page === 1) {
          state.isLoading = true;
        } else {
          state.isLoadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        
        const { data, meta } = action.payload;
        
        if (action.meta.arg.page === 1) {
          state.products = data;
        } else {
          state.products = [...state.products, ...data];
        }
        
        state.pagination = {
          currentPage: meta.current_page,
          totalPages: meta.last_page,
          totalItems: meta.total,
          hasMore: meta.current_page < meta.last_page,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingMore = false;
        state.error = action.payload;
      })

      // Fetch categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Fetch brands
      .addCase(fetchBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      });
  },
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentProduct,
  clearProducts,
} = productSlice.actions;

export default productSlice.reducer;
