import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  customers: [],
  customer: null,
};

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getCustomersSuccess(state, action) {
      state.isLoading = false;
      state.customers = action.payload;
    },
    getCustomerSuccess(state, action) {
      state.isLoading = false;
      state.customer = action.payload;
    },
    addCustomerSuccess(state, action) {
      state.isLoading = false;
      state.customers.push(action.payload);
    },
    updateCustomerSuccess(state, action) {
      state.isLoading = false;
      const index = state.customers.findIndex((customer) => customer._id === action.payload._id);
      if (index !== -1) {
        state.customers[index] = action.payload;
      }
    },
    deleteCustomerSuccess(state, action) {
      state.isLoading = false;
      state.customers = state.customers.filter((customer) => customer._id !== action.payload);
    },
    resetCustomer(state) {
      state.customer = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getCustomersSuccess,
  getCustomerSuccess,
  resetCustomer,
  updateCustomerSuccess,
  addCustomerSuccess,
  deleteCustomerSuccess,
} = customerSlice.actions;

export default customerSlice.reducer;

export const fetchCustomers = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/customers');
    dispatch(getCustomersSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchCustomer = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/customers/${id}`);
    dispatch(getCustomerSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addCustomer = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/customers`, data);
    dispatch(addCustomerSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateCustomer = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/customers/${id}`, data);
    dispatch(updateCustomerSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteCustomer = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/customers/${id}`);
    dispatch(deleteCustomerSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
