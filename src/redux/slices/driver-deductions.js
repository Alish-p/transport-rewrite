import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

const initialState = {
  isLoading: false,
  error: null,
  driverDeductions: [],
  driverDeduction: null,
};

const driverDeductionSlice = createSlice({
  name: 'driverDeduction',
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
    addDriverDeductionSuccess(state, action) {
      state.isLoading = false;
      state.driverDeductions.push(action.payload);
    },
    getDriverDeductionsSuccess(state, action) {
      state.isLoading = false;
      state.driverDeductions = action.payload;
    },
    getDriverDeductionSuccess(state, action) {
      state.isLoading = false;
      state.driverDeduction = action.payload;
    },
    deleteDriverDeductionSuccess(state, action) {
      state.isLoading = false;
      state.driverDeductions = state.driverDeductions.filter(
        (deduction) => deduction._id !== action.payload
      );
    },
    updateDriverDeductionSuccess(state, action) {
      // For updating a deduction
      state.isLoading = false;
      const index = state.driverDeductions.findIndex(
        (deduction) => deduction._id === action.payload._id
      );
      if (index !== -1) {
        state.driverDeductions[index] = action.payload;
      }
      if (state.driverDeduction && state.driverDeduction._id === action.payload._id) {
        state.driverDeduction = action.payload;
      }
    },
  },
});

export const {
  startLoading,
  hasError,
  addDriverDeductionSuccess,
  getDriverDeductionsSuccess,
  getDriverDeductionSuccess,
  deleteDriverDeductionSuccess,
  updateDriverDeductionSuccess,
} = driverDeductionSlice.actions;

export default driverDeductionSlice.reducer;

// Thunks

export const fetchDriverDeductions = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/driverDeductions');
    dispatch(getDriverDeductionsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchDriverDeduction = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/driverDeductions/${id}`);
    dispatch(getDriverDeductionSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addDriverDeduction = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/driverDeductions`, data);
    dispatch(addDriverDeductionSuccess(response.data));
    return response.data; // Return the created deduction
  } catch (error) {
    dispatch(hasError(error));
    throw error; // Re-throw the error for handling in the component
  }
};

export const deleteDriverDeduction = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/driverDeductions/${id}`);
    dispatch(deleteDriverDeductionSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateDriverDeduction = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/driverDeductions/${id}`, data);
    dispatch(updateDriverDeductionSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};
