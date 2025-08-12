import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/invoices';
const QUERY_KEY = 'invoices';

// Fetchers
const getPaginatedInvoices = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};

const getInvoice = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createInvoice = async (invoice) => {
  const { data } = await axios.post(ENDPOINT, invoice);
  return data;
};

const updateInvoiceStatus = async (id, status, amount) => {
  const payload = { invoiceStatus: status };
  if (amount !== undefined) {
    payload.amount = amount;
  }
  const { data } = await axios.put(`${ENDPOINT}/${id}`, payload);
  return data;
};

const deleteInvoice = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

const cancelInvoice = async (id) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/cancel`);
  return data;
};

// Queries & Mutations
export function usePaginatedInvoices(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedInvoices(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useInvoice(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
  });
}

export function useCreateInvoice() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Invoice added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, status, amount }) => updateInvoiceStatus(id, status, amount),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedInvoice._id], updatedInvoice);

      toast.success('Invoice status changed successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useCancelInvoice() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (id) => cancelInvoice(id),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedInvoice._id], updatedInvoice);

      toast.success('Invoice cancelled successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteInvoice(id),
    onSuccess: (_) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Invoice deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
