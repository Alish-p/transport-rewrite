import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  trips: [],
  trip: null,
};

const tripDetailsSlice = createSlice({
  name: 'tripDetails',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getTripsSuccess(state, action) {
      state.isLoading = false;
      state.trips = action.payload;
    },
    getTripSuccess(state, action) {
      state.isLoading = false;
      state.trip = action.payload;
    },
    addTripSuccess(state, action) {
      state.isLoading = false;
      state.trips.push(action.payload);
    },
    updateTripSuccess(state, action) {
      state.isLoading = false;
      const index = state.trips.findIndex((trip) => trip.id === action.payload.id);
      if (index !== -1) {
        state.trips[index] = action.payload;
      }
    },
    deleteTripSuccess(state, action) {
      state.isLoading = false;
      state.trips = state.trips.filter((trip) => trip._id !== action.payload);
    },
    resetTrip(state) {
      state.trip = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getTripsSuccess,
  getTripSuccess,
  addTripSuccess,
  updateTripSuccess,
  deleteTripSuccess,
  resetTrip,
} = tripDetailsSlice.actions;

export default tripDetailsSlice.reducer;

// Thunk actions for Trips
export const fetchTrips = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/trips');
    dispatch(getTripsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchTrip = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/trips/${id}/totals`);
    dispatch(getTripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addTrip = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/trips`, data);
    dispatch(addTripSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

export const updateTrip = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/trips/${id}`, data);
    dispatch(updateTripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteTrip = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/trips/${id}`);
    dispatch(deleteTripSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
