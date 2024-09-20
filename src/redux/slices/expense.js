import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  expenses: [],
  expense: null,
};

const expenseSlice = createSlice({
  name: 'expense',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getExpensesSuccess(state, action) {
      state.isLoading = false;
      state.expenses = action.payload;
    },
    getExpenseSuccess(state, action) {
      state.isLoading = false;
      state.expense = action.payload;
    },
    addExpenseSuccess(state, action) {
      state.isLoading = false;
      state.expenses.push(action.payload);
    },
    updateExpenseSuccess(state, action) {
      state.isLoading = false;
      const index = state.expenses.findIndex((expense) => expense._id === action.payload.id);
      if (index !== -1) {
        state.expenses[index] = action.payload;
      }
    },
    deleteExpenseSuccess(state, action) {
      state.isLoading = false;
      state.expenses = state.expenses.filter((expense) => expense._id !== action.payload);
    },
    resetExpense(state) {
      state.expense = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getExpensesSuccess,
  getExpenseSuccess,
  resetExpense,
  updateExpenseSuccess,
  addExpenseSuccess,
  deleteExpenseSuccess,
} = expenseSlice.actions;

export default expenseSlice.reducer;

export const fetchExpenses = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/expenses');
    dispatch(getExpensesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchExpense = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/expenses/${id}`);
    dispatch(getExpenseSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addExpense = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/expenses`, data);
    dispatch(addExpenseSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateExpense = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/expenses/${id}`, data);
    dispatch(updateExpenseSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteExpense = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/expenses/${id}`);
    dispatch(deleteExpenseSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
