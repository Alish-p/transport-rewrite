import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';

import { toast } from 'src/components/snackbar';

const initialState = {
  isLoading: false,
  error: null,
  loans: [],
  loan: null,
};

const loanSlice = createSlice({
  name: 'loan',
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
    addLoanSuccess(state, action) {
      state.isLoading = false;
      state.loans.push(action.payload);
    },
    getLoansSuccess(state, action) {
      state.isLoading = false;
      state.loans = action.payload;
    },
    getLoanSuccess(state, action) {
      state.isLoading = false;
      state.loan = action.payload;
    },
    deleteLoanSuccess(state, action) {
      state.isLoading = false;
      state.loans = state.loans.filter((deduction) => deduction._id !== action.payload);
    },
    updateLoanSuccess(state, action) {
      // For updating a deduction
      state.isLoading = false;
      const index = state.loans.findIndex((deduction) => deduction._id === action.payload._id);
      if (index !== -1) {
        state.loans[index] = action.payload;
      }
      if (state.loan && state.loan._id === action.payload._id) {
        state.loan = action.payload;
      }
    },
  },
});

export const {
  startLoading,
  hasError,
  addLoanSuccess,
  getLoansSuccess,
  getLoanSuccess,
  deleteLoanSuccess,
  updateLoanSuccess,
} = loanSlice.actions;

export default loanSlice.reducer;

// Thunks

export const fetchLoans = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/loans');
    dispatch(getLoansSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchPendingLoans =
  ({ borrowerType, id }) =>
  async (dispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.get(`/api/loans/pending/${borrowerType}/${id}`);
      dispatch(getLoansSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

export const fetchLoan = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/loans/${id}`);
    dispatch(getLoanSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addLoan = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/loans`, data);
    dispatch(addLoanSuccess(response.data));
    return response.data; // Return the created deduction
  } catch (error) {
    dispatch(hasError(error));
    throw error; // Re-throw the error for handling in the component
  }
};

export const deleteLoan = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/loans/${id}`);
    dispatch(deleteLoanSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateLoan = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/loans/${id}`, data);
    dispatch(updateLoanSuccess(response.data));
    return response.data;
  } catch (error) {
    dispatch(hasError(error));
    throw error;
  }
};
