import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  dieselPrices: [],
  dieselPrice: null,
};

const dieselPriceSlice = createSlice({
  name: 'dieselPrice',
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
    getDieselPricesSuccess(state, action) {
      state.isLoading = false;
      state.dieselPrices = action.payload;
    },
    getDieselPriceSuccess(state, action) {
      state.isLoading = false;
      state.dieselPrice = action.payload;
    },
    addDieselPriceSuccess(state, action) {
      state.isLoading = false;
      state.dieselPrices.push(action.payload);
    },
    updateDieselPriceSuccess(state, action) {
      state.isLoading = false;
      const index = state.dieselPrices.findIndex((price) => price._id === action.payload._id);
      if (index !== -1) {
        state.dieselPrices[index] = action.payload;
      }
    },
    deleteDieselPriceSuccess(state, action) {
      state.isLoading = false;
      state.dieselPrices = state.dieselPrices.filter((price) => price._id !== action.payload);
    },
    resetDieselPrice(state) {
      state.dieselPrice = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getDieselPricesSuccess,
  getDieselPriceSuccess,
  addDieselPriceSuccess,
  updateDieselPriceSuccess,
  deleteDieselPriceSuccess,
  resetDieselPrice,
} = dieselPriceSlice.actions;

export default dieselPriceSlice.reducer;

export const fetchDieselPrices = (filters) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const { pump, startDate, endDate } = filters || {};
    let query = '/api/diesel-prices?';

    if (pump) query += `pump=${pump}&`;
    if (startDate) query += `startDate=${startDate}&`;
    if (endDate) query += `endDate=${endDate}&`;

    const response = await axios.get(query);
    dispatch(getDieselPricesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchDieselPrice = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/diesel-prices/${id}`);
    dispatch(getDieselPriceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addDieselPrice = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post('/api/diesel-prices', data);
    dispatch(addDieselPriceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateDieselPrice = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/diesel-prices/${id}`, data);
    dispatch(updateDieselPriceSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteDieselPrice = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/diesel-prices/${id}`);
    dispatch(deleteDieselPriceSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
