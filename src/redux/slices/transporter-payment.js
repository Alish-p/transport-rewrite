import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  payments: [],
  payment: null,
};

const transporterPaymentSlice = createSlice({
  name: 'transporterPayment',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPaymentSuccess(state, action) {
      state.isLoading = false;
      state.payments.push(action.payload);
    },
    getPaymentsSuccess(state, action) {
      state.isLoading = false;
      state.payments = action.payload;
    },
    getPaymentSuccess(state, action) {
      state.isLoading = false;
      state.payment = action.payload;
    },
  },
});

export const { startLoading, hasError, addPaymentSuccess, getPaymentsSuccess, getPaymentSuccess } =
  transporterPaymentSlice.actions;

export default transporterPaymentSlice.reducer;

export const fetchPayments = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/transporter-payments');
    dispatch(getPaymentsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchPayment = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/transporter-payments/${id}`);
    dispatch(getPaymentSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deletePayment = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.delete(`/api/transporter-payments/${id}`);
    dispatch(getPaymentSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addPayment = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/transporter-payments`, data);
    dispatch(addPaymentSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};
