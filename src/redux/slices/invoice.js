import { createSlice } from '@reduxjs/toolkit';

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
    },
    addInvoiceSuccess(state, action) {
      state.isLoading = false;
      state.invoices.push(action.payload);
    },
    getInvoicesSuccess(state, action) {
      state.isLoading = false;
      state.invoices = action.payload;
    },
    getInvoiceSuccess(state, action) {
      state.isLoading = false;
      state.invoice = action.payload;
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
  } catch (error) {
    dispatch(hasError(error));
  }
};
