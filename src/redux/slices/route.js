import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  routes: [],
  route: null,
  customerSpecificRoutes: [],
};

const routeSlice = createSlice({
  name: 'route',
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
    getRoutesSuccess(state, action) {
      state.isLoading = false;
      state.routes = action.payload;
    },
    getCustomerSpecificRoutesSuccess(state, action) {
      state.isLoading = false;
      state.customerSpecificRoutes = action.payload;
    },
    getRouteSuccess(state, action) {
      state.isLoading = false;
      state.route = action.payload;
    },
    addRouteSuccess(state, action) {
      state.isLoading = false;
      state.routes.push(action.payload);
    },
    updateRouteSuccess(state, action) {
      state.isLoading = false;
      const index = state.routes.findIndex((route) => route._id === action.payload.id);
      if (index !== -1) {
        state.routes[index] = action.payload;
      }
    },
    deleteRouteSuccess(state, action) {
      state.isLoading = false;
      state.routes = state.routes.filter((route) => route._id !== action.payload);
    },
    resetRoute(state) {
      state.route = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getRoutesSuccess,
  getRouteSuccess,
  addRouteSuccess,
  updateRouteSuccess,
  deleteRouteSuccess,
  resetRoute,
  getCustomerSpecificRoutesSuccess,
} = routeSlice.actions;

export default routeSlice.reducer;

export const fetchRoutes = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/routes');
    dispatch(getRoutesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchCustomerSpecificRoutes = (customerId) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post('/api/routes/fetchCustomerSpecificRoutes', {
      customerId,
    });
    dispatch(getCustomerSpecificRoutesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchRoute = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/routes/${id}`);
    dispatch(getRouteSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addRoute = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/routes`, data);
    dispatch(addRouteSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateRoute = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/routes/${id}`, data);
    dispatch(updateRouteSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteRoute = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/routes/${id}`);
    dispatch(deleteRouteSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
