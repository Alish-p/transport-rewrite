import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  vehicles: [],
  vehicle: null,
};

const vehicleSlice = createSlice({
  name: 'vehicle',
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
    getVehiclesSuccess(state, action) {
      state.isLoading = false;
      state.vehicles = action.payload;
    },
    getVehicleSuccess(state, action) {
      state.isLoading = false;
      state.vehicle = action.payload;
    },
    addVehicleSuccess(state, action) {
      state.isLoading = false;
      state.vehicles.push(action.payload);
    },
    updateVehicleSuccess(state, action) {
      state.isLoading = false;
      const index = state.vehicles.findIndex((vehicle) => vehicle._id === action.payload._id);
      if (index !== -1) {
        state.vehicles[index] = action.payload;
      }
    },
    deleteVehicleSuccess(state, action) {
      state.isLoading = false;
      state.vehicles = state.vehicles.filter((vehicle) => vehicle._id !== action.payload);
    },
    resetVehicle(state) {
      state.vehicle = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getVehiclesSuccess,
  getVehicleSuccess,
  resetVehicle,
  updateVehicleSuccess,
  addVehicleSuccess,
  deleteVehicleSuccess,
} = vehicleSlice.actions;

export default vehicleSlice.reducer;

export const fetchVehicles = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/vehicles');
    dispatch(getVehiclesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchVehicle = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/vehicles/${id}`);
    dispatch(getVehicleSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addVehicle = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/vehicles`, data);
    dispatch(addVehicleSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateVehicle = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/vehicles/${id}`, data);
    dispatch(updateVehicleSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteVehicle = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/vehicles/${id}`);
    dispatch(deleteVehicleSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
