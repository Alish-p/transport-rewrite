import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/expenses';
const QUERY_KEY = 'expenses';

// Fetchers
const getExpenses = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getAllExpensesOfSubtrip = async (subtripId) => {
  const { data } = await axios.get(`${ENDPOINT}/subtrip/${subtripId}`);
  return data;
};

const getPastFilteredExpenses = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};

const getPaginatedExpenses = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}/pagination`, { params });
  return data;
};

const getExpense = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createExpense = async (expense) => {
  const { data } = await axios.post(ENDPOINT, expense);
  return data;
};

const updateExpense = async (id, expenseData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, expenseData);
  return data;
};

const deleteExpense = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useExpenses() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getExpenses });
}

export function useFilteredExpenses(params) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getPastFilteredExpenses(params),
    enabled: !!params,
  });
}

export function usePaginatedExpenses(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedExpenses(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useAllExpensesOfSubtrip(subtripId) {
  return useQuery({
    queryKey: [QUERY_KEY, 'subtrip', subtripId],
    queryFn: () => getAllExpensesOfSubtrip(subtripId),
    enabled: !!subtripId,
  });
}

export function useExpense(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getExpense(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Expense added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: (updatedExpense) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedExpense._id], updatedExpense);

      toast.success('Expense edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Expense deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
