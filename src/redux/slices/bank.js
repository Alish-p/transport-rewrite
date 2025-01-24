import { createSlice } from '@reduxjs/toolkit';

import { toast } from 'src/components/snackbar';

import axios from '../../utils/axios';

const initialState = {
  isLoading: false,
  error: null,
  banks: [],
  bank: null,
};

const bankSlice = createSlice({
  name: 'bank',
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
    getBanksSuccess(state, action) {
      state.isLoading = false;
      state.banks = action.payload;
    },
    getBankSuccess(state, action) {
      state.isLoading = false;
      state.bank = action.payload;
    },
    addBankSuccess(state, action) {
      state.isLoading = false;
      state.banks.push(action.payload);
    },
    updateBankSuccess(state, action) {
      state.isLoading = false;
      const index = state.banks.findIndex((bank) => bank._id === action.payload.id);
      if (index !== -1) {
        state.banks[index] = action.payload;
      }
    },
    deleteBankSuccess(state, action) {
      state.isLoading = false;
      state.banks = state.banks.filter((bank) => bank._id !== action.payload);
    },
    resetBank(state) {
      state.bank = null;
    },
  },
});

export const {
  startLoading,
  hasError,
  getBanksSuccess,
  getBankSuccess,
  addBankSuccess,
  updateBankSuccess,
  deleteBankSuccess,
  resetBank,
} = bankSlice.actions;

export default bankSlice.reducer;

export const fetchBanks = () => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get('/api/banks');
    dispatch(getBanksSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const fetchBank = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.get(`/api/banks/${id}`);
    dispatch(getBankSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const addBank = (data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.post(`/api/banks`, data);
    dispatch(addBankSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const updateBank = (id, data) => async (dispatch) => {
  dispatch(startLoading());
  try {
    const response = await axios.put(`/api/banks/${id}`, data);
    dispatch(updateBankSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const deleteBank = (id) => async (dispatch) => {
  dispatch(startLoading());
  try {
    await axios.delete(`/api/banks/${id}`);
    dispatch(deleteBankSuccess(id));
  } catch (error) {
    dispatch(hasError(error));
  }
};
