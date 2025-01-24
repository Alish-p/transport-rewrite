import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  subtrips: [],
  filteredSubtrips: [],
  subtrip: null,
};

const subtripSlice = createSlice({
  name: 'subtrip',
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
    getSubtripsSuccess(state, action) {
      state.isLoading = false;
      state.subtrips = action.payload;
    },
    getSubtripSuccess(state, action) {
      state.isLoading = false;
      state.subtrip = action.payload;
    },
    addSubtripSuccess(state, action) {
      state.isLoading = false;
      state.subtrips.push(action.payload);
    },
    addMaterialInfoSuccess(state, action) {
      state.isLoading = false;
      state.subtrip = action.payload;
      const index = state.subtrips.findIndex((subtrip) => subtrip._id === action.payload._id);
      if (index !== -1) {
        state.subtrips[index] = action.payload;
      }
    },
    updateSubtripSuccess(state, action) {
      state.isLoading = false;
      state.subtrip = action.payload;
      const index = state.subtrips.findIndex((subtrip) => subtrip._id === action.payload._id);
      if (index !== -1) {
        state.subtrips[index] = action.payload;
      }
    },
    deleteSubtripSuccess(state, action) {
      state.isLoading = false;
      state.subtrips = state.subtrips.filter((subtrip) => subtrip._id !== action.payload);
    },
    resetSubtrip(state) {
      state.subtrip = null;
    },
    addExpenseSuccess(state, action) {
      state.isLoading = false;
      if (state.subtrip && state.subtrip._id === action.payload.subtripId) {
        state.subtrip.expenses.push(action.payload.expense);
      }
    },
    getFilteredSubtripsSuccess(state, action) {
      state.isLoading = false;
      state.filteredSubtrips = action.payload.data;
    },
    resetFilteredSubtrips(state) {
      state.filteredSubtrips = [];
    },
  },
});

export const {
  startLoading,
  hasError,
  getSubtripsSuccess,
  getSubtripSuccess,
  resetSubtrip,
  updateSubtripSuccess,
  addSubtripSuccess,
  deleteSubtripSuccess,
  addExpenseSuccess,
  getFilteredSubtripsSuccess,
  resetFilteredSubtrips,
} = subtripSlice.actions;

export default subtripSlice.reducer;

export const fetchSubtrips = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/subtrips');
    dispatch(getSubtripsSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchSubtrip = (id) => async (dispatch) => {
  dispatch(startLoading());

  try {
    const response = await axios.get(`/api/subtrips/${id}`);
    dispatch(getSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addSubtrip = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/subtrips/${id}`, data);
    dispatch(addSubtripSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Add Material Info
export const addMaterialInfo = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/subtrips/${id}/material-info`, data);
    dispatch(updateSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Receive LR
export const receiveLR = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/subtrips/${id}/receive`, data);
    dispatch(updateSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Resolve LR
export const resolveLR = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/subtrips/${id}/resolve`, data);
    dispatch(updateSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Close LR
export const closeTrip = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/subtrips/${id}/close`, data);
    dispatch(updateSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

export const updateSubtrip = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/subtrips/${id}`, data);
    dispatch(updateSubtripSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

export const deleteSubtrip = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/subtrips/${id}`);
    dispatch(deleteSubtripSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Add Expense
export const addExpense = (subtripId, expenseData) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/subtrips/${subtripId}/expense`, expenseData);
    dispatch(addExpenseSuccess({ subtripId, expense: response.data }));
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};

// Billing...
export const fetchClosedTripsByCustomerAndDate = async (customerId, fromDate, toDate) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post('/api/subtrips/fetchClosedTripsByCustomerAndDate', {
      customerId,
      fromDate,
      toDate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Billing...
export const fetchTripsCompletedByDriverAndDate = async (
  driverId,
  periodStartDate,
  periodEndDate
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post('/api/subtrips/fetchTripsCompletedByDriverAndDate', {
      driverId,
      fromDate: periodStartDate,
      toDate: periodEndDate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchClosedSubtripsByTransporterAndDate = async (
  transporterId,
  periodStartDate,
  periodEndDate
) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const response = await axios.post('/api/subtrips/fetchClosedSubtripsByTransporterAndDate', {
      transporterId,
      fromDate: periodStartDate,
      toDate: periodEndDate,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchFilteredSubtrips =
  (filterType, entityId, fromDate, toDate) => async (dispatch) => {
    dispatch(startLoading());
    dispatch(resetFilteredSubtrips());
    try {
      let response;
      let filteredData = [];
      switch (filterType) {
        case 'customer':
          response = await axios.post('/api/subtrips/fetchClosedTripsByCustomerAndDate', {
            customerId: entityId,
            fromDate,
            toDate,
          });
          filteredData = response.data;
          break;
        case 'transporter':
          response = await axios.post('/api/subtrips/fetchClosedSubtripsByTransporterAndDate', {
            transporterId: entityId,
            fromDate,
            toDate,
          });
          filteredData = response.data;
          break;
        case 'driver':
          response = await axios.post('/api/subtrips/fetchTripsCompletedByDriverAndDate', {
            driverId: entityId,
            fromDate,
            toDate,
          });
          filteredData = response.data;
          break;
        default:
          throw new Error('Invalid filter type');
      }

      dispatch(getFilteredSubtripsSuccess({ data: filteredData, filterType }));
      return { data: filteredData, filterType };
    } catch (error) {
      dispatch(hasError(error));
      throw error;
    }
  };
