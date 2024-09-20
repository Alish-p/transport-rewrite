import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  transporters: [],
  transporter: null,
};

const transporterSlice = createSlice({
  name: 'transporter',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getTransportersSuccess(state, action) {
      state.isLoading = false;
      state.transporters = action.payload;
    },
    getTransporterSuccess(state, action) {
      state.isLoading = false;
      state.transporter = action.payload;
    },
    addTransporterSuccess(state, action) {
      state.isLoading = false;
      console.log(action.payload);
      state.transporters.push(action.payload);
    },
    updateTransporterSuccess(state, action) {
      state.isLoading = false;
      const index = state.transporters.findIndex(
        (transporter) => transporter._id === action.payload.id
      );
      if (index !== -1) {
        state.transporters[index] = action.payload;
      }
    },
    deleteTransporterSuccess(state, action) {
      state.isLoading = false;
      state.transporters = state.transporters.filter(
        (transporter) => transporter._id !== action.payload
      );
    },
    resetTransporter(state) {
      state.transporter = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getTransportersSuccess,
  getTransporterSuccess,
  resetTransporter,
  updateTransporterSuccess,
  addTransporterSuccess,
  deleteTransporterSuccess,
} = transporterSlice.actions;

export default transporterSlice.reducer;

export const fetchTransporters = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/transporters');
    dispatch(getTransportersSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchTransporter = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/transporters/${id}`);
    dispatch(getTransporterSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addTransporter = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/transporters`, data);
    dispatch(addTransporterSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateTransporter = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/transporters/${id}`, data);
    dispatch(updateTransporterSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteTransporter = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/transporters/${id}`);
    dispatch(deleteTransporterSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
