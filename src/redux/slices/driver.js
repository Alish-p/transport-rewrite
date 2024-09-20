import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  drivers: [],
  driver: null,
};

const driverSlice = createSlice({
  name: 'driver',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getDriversSuccess(state, action) {
      state.isLoading = false;
      state.drivers = action.payload;
    },
    getDriverSuccess(state, action) {
      state.isLoading = false;
      state.driver = action.payload;
    },
    addDriverSuccess(state, action) {
      state.isLoading = false;
      state.drivers.push(action.payload);
    },
    updateDriverSuccess(state, action) {
      state.isLoading = false;
      const index = state.drivers.findIndex((driver) => driver._id === action.payload._id);
      if (index !== -1) {
        state.drivers[index] = action.payload;
      }
    },
    deleteDriverSuccess(state, action) {
      state.isLoading = false;
      console.log({ action, drivers: state.drivers });
      state.drivers = state.drivers.filter((driver) => driver._id !== action.payload);
    },
    resetDriver(state) {
      state.driver = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getDriversSuccess,
  getDriverSuccess,
  resetDriver,
  updateDriverSuccess,
  addDriverSuccess,
  deleteDriverSuccess,
} = driverSlice.actions;

export default driverSlice.reducer;

export const fetchDrivers = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/drivers');
    dispatch(getDriversSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchDriver = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/drivers/${id}`);
    dispatch(getDriverSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addDriver = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/drivers`, data);
    dispatch(addDriverSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateDriver = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/drivers/${id}`, data);
    dispatch(updateDriverSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteDriver = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/drivers/${id}`);
    dispatch(deleteDriverSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
