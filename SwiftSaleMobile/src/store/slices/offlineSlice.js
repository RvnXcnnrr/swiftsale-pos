import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOnline: true,
  pendingSales: [],
  syncInProgress: false,
  lastSyncTime: null,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action) => {
      state.isOnline = action.payload;
    },
    
    addPendingSale: (state, action) => {
      state.pendingSales.push({
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      });
    },
    
    removePendingSale: (state, action) => {
      const saleId = action.payload;
      state.pendingSales = state.pendingSales.filter(sale => sale.id !== saleId);
    },
    
    clearPendingSales: (state) => {
      state.pendingSales = [];
    },
    
    setSyncInProgress: (state, action) => {
      state.syncInProgress = action.payload;
    },
    
    setLastSyncTime: (state, action) => {
      state.lastSyncTime = action.payload;
    },
  },
});

export const {
  setOnlineStatus,
  addPendingSale,
  removePendingSale,
  clearPendingSales,
  setSyncInProgress,
  setLastSyncTime,
} = offlineSlice.actions;

export default offlineSlice.reducer;
