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

const repayLoan = async ({ id, amount, paidDate, installmentNumber, remarks }) => {
  const { data } = await axios.post(`${ENDPOINT}/${id}/repay`, {
    amount,
    paidDate,
    installmentNumber,
    remarks,
  });
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

const deferNextInstallment = async ({ id, deferredTo }) => {
  const { data } = await axios.post(`${ENDPOINT}/${id}/defer-next`, { deferredTo });
  return data;
};

// API for “defer all installments”
const deferAllInstallments = async ({ id, days }) => {
  const { data } = await axios.post(`${ENDPOINT}/${id}/defer-all`, { days });
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
  const { mutateAsync } = useMutation({
    mutationFn: createLoan,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Loan added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateLoan() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateLoan(id, data),
    onSuccess: (updatedLoan) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedLoan._id], updatedLoan);

      toast.success('Loan edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteLoan() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteLoan(id),
    onSuccess: (_,) => {
      queryClient.invalidateQueries([QUERY_KEY]);
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

export function useRepayLoan() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: repayLoan,
    onSuccess: (updatedLoan) => {
      // Invalidate list, update detail cache
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedLoan._id], updatedLoan);

      toast.success('Payment recorded successfully!');
    },
    onError: (error) => {
      const msg = error?.response?.data?.message || error?.message || 'Repayment failed';
      toast.error(msg);
    },
  });

  return mutateAsync;
}

// Hook to defer next pending EMI
export function useDeferNextInstallment() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: deferNextInstallment,
    onSuccess: (updatedLoan) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedLoan._id], updatedLoan);
      toast.success('Next installment deferred');
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to defer next installment';
      toast.error(msg);
    },
  });

  return mutateAsync;
}

// Hook to defer all pending EMIs
export function useDeferAllInstallments() {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: deferAllInstallments,
    onSuccess: (updatedLoan) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedLoan._id], updatedLoan);
      toast.success('All installments deferred');
    },
    onError: (error) => {
      const msg =
        error?.response?.data?.message || error?.message || 'Failed to defer all installments';
      toast.error(msg);
    },
  });

  return mutateAsync;
}
