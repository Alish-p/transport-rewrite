import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

const initialState = {
  isLoading: false,
  error: null,
  summary: {
    totalDrivers: 0,
    totalTransporters: 0,
    totalVehicles: 0,
    totalInvoices: 0,
    totalSubtrips: 0,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;

      if (action.payload) {
        const errorMessage = action.payload.message || 'An error occurred';
        toast.error(errorMessage);
      }
    },
    getDashboardSummarySuccess(state, action) {
      state.isLoading = false;
      state.summary = action.payload;
    },
    resetDashboard(state) {
      state.summary = initialState.summary;
    },
  },
});

export const { startLoading, hasError, getDashboardSummarySuccess, resetDashboard } =
  dashboardSlice.actions;

export default dashboardSlice.reducer;

// Fetch Dashboard Summary
export const fetchDashboardSummary = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/dashboard/summary');
    dispatch(getDashboardSummarySuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};
