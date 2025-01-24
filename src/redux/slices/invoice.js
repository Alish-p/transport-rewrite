import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  invoices: [],
  invoice: null,
};

const invoiceSlice = createSlice({
  name: 'invoice',
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

    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
      state.error = null;
    },

    getInvoiceSuccess(state, action) {
      state.isLoading = false;
      state.invoice = action.payload;
      state.error = null;
    },

    addInvoiceSuccess(state, action) {
      state.isLoading = false;
      state.invoices.push(action.payload);
      state.error = null;
    },

    updateInvoiceSuccess(state, action) {
      state.isLoading = false;
      const updatedInvoice = action.payload;
      const index = state.invoices.findIndex((invoice) => invoice._id === updatedInvoice._id);
      if (index !== -1) {
        state.invoices[index] = updatedInvoice;
      }
      state.error = null;
    },

    deleteInvoiceSuccess(state, action) {
      state.isLoading = false;
      state.invoices = state.invoices.filter((invoice) => invoice._id !== action.payload); // action.payload should be the ID
      state.error = null;
    },
    resetInvoice(state) {
      state.invoice = null;
    },
  },
});

export const { startLoading, hasError, addInvoiceSuccess, getInvoicesSuccess, getInvoiceSuccess } =
  invoiceSlice.actions;

export default invoiceSlice.reducer;

export const fetchInvoices = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/invoices');
    dispatch(getInvoicesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchInvoice = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/invoices/${id}`);
    dispatch(getInvoiceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteInvoice = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.delete(`/api/invoices/${id}`);
    dispatch(getInvoiceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addInvoice = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/invoices`, data);
    dispatch(addInvoiceSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

export const updateInvoiceStatus = (id, status) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/invoices/${id}`, { invoiceStatus: status });
    dispatch(getInvoiceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};
