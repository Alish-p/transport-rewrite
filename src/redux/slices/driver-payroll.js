import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  payrollReceipts: [],
  payrollReceipt: null,
};

const driverPayrollSlice = createSlice({
  name: 'driverPayroll',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPayrollReceiptSuccess(state, action) {
      state.isLoading = false;
      state.payrollReceipts.push(action.payload);
    },
    getPayrollReceiptsSuccess(state, action) {
      state.isLoading = false;
      state.payrollReceipts = action.payload;
    },
    getPayrollReceiptSuccess(state, action) {
      state.isLoading = false;
      state.payrollReceipt = action.payload;
    },
    deletePayrollReceiptSuccess(state, action) {
      state.isLoading = false;
      state.payrollReceipts = state.payrollReceipts.filter(
        (receipt) => receipt._id !== action.payload
      );
    },
  },
});

export const {
  startLoading,
  hasError,
  addPayrollReceiptSuccess,
  getPayrollReceiptsSuccess,
  getPayrollReceiptSuccess,
  deletePayrollReceiptSuccess,
} = driverPayrollSlice.actions;

export default driverPayrollSlice.reducer;

// Thunks

export const fetchPayrollReceipts = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/driverPayroll');
    dispatch(getPayrollReceiptsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchPayrollReceipt = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/driverPayroll/${id}`);
    dispatch(getPayrollReceiptSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addPayrollReceipt = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/driverPayroll`, data);
    dispatch(addPayrollReceiptSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

export const deletePayrollReceipt = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/driverPayroll/${id}`);
    dispatch(deletePayrollReceiptSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updatePayrollStatus = (id, status) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/driverPayroll/${id}`, { status });
    dispatch(getPayrollReceiptSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};
