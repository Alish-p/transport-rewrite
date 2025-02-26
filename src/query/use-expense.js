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

export function useExpense(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getExpense(id),
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createExpense,
    onSuccess: (newExpense) => {
      console.log({ newExpense });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevExpenses) => [...prevExpenses, newExpense]);
      // caching current expense
      queryClient.setQueryData([QUERY_KEY, newExpense._id], newExpense);
      toast.success('Expense added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateExpense(id, data),
    onSuccess: (updatedExpense) => {
      queryClient.setQueryData([QUERY_KEY], (prevExpenses) =>
        prevExpenses.map((expense) =>
          expense._id === updatedExpense._id ? updatedExpense : expense
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedExpense._id], updatedExpense);

      toast.success('Expense edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevExpenses) =>
        prevExpenses.filter((expense) => expense._id !== id)
      );
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
