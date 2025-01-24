import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  pumps: [],
  pump: null,
};

const pumpSlice = createSlice({
  name: 'pump',
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
    getPumpsSuccess(state, action) {
      state.isLoading = false;
      state.pumps = action.payload;
    },
    getPumpSuccess(state, action) {
      state.isLoading = false;
      state.pump = action.payload;
    },
    addPumpSuccess(state, action) {
      state.isLoading = false;
      state.pumps.push(action.payload);
    },
    updatePumpSuccess(state, action) {
      state.isLoading = false;
      const index = state.pumps.findIndex((pump) => pump._id === action.payload.id);
      if (index !== -1) {
        state.pumps[index] = action.payload;
      }
    },
    deletePumpSuccess(state, action) {
      state.isLoading = false;
      state.pumps = state.pumps.filter((pump) => pump._id !== action.payload);
    },
    resetPump(state) {
      state.pump = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getPumpsSuccess,
  getPumpSuccess,
  addPumpSuccess,
  updatePumpSuccess,
  deletePumpSuccess,
  resetPump,
} = pumpSlice.actions;

export default pumpSlice.reducer;

export const fetchPumps = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/pumps');
    dispatch(getPumpsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchPump = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/pumps/${id}`);
    dispatch(getPumpSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addPump = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/pumps`, data);
    dispatch(addPumpSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updatePump = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/pumps/${id}`, data);
    dispatch(updatePumpSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deletePump = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/pumps/${id}`);
    dispatch(deletePumpSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
