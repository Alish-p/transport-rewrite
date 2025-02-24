import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/loans';
const QUERY_KEY = 'loans';

// Fetchers
const getLoans = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getLoan = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createLoan = async (loan) => {
  const { data } = await axios.post(ENDPOINT, loan);
  return data;
};

const updateLoan = async (id, loanData) => {
  console.log({ loanDataInAPICAll: loanData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, loanData);
  return data;
};

const deleteLoan = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useLoans() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getLoans });
}

export function useLoan(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getLoan(id),
    enabled: !!id,
  });
}

export function useCreateLoan() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createLoan,
    onSuccess: (newLoan) => {
      console.log({ newLoan });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevLoans) => [...prevLoans, newLoan]);
      // caching current loan
      queryClient.setQueryData([QUERY_KEY, newLoan._id], newLoan);
      toast.success('Loan added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateLoan(id, data),
    onSuccess: (updatedLoan) => {
      queryClient.setQueryData([QUERY_KEY], (prevLoans) =>
        prevLoans.map((loan) => (loan._id === updatedLoan._id ? updatedLoan : loan))
      );
      queryClient.setQueryData([QUERY_KEY, updatedLoan._id], updatedLoan);

      toast.success('Loan edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteLoan(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevLoans) =>
        prevLoans.filter((loan) => loan._id !== id)
      );
      toast.success('Loan deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
