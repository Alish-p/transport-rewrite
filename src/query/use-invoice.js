import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/invoices';
const QUERY_KEY = 'invoices';

// Fetchers
const getInvoices = async () => {
  const { data } = await axios.get(ENDPOINT);
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

const updateInvoice = async (id, invoiceData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, invoiceData);
  return data;
};

const updateInvoiceStatus = async (id, status) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, { invoiceStatus: status });
  return data;
};

const deleteInvoice = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useInvoices() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getInvoices });
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
    onSuccess: (newInvoice) => {
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

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: (updatedInvoice) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedInvoice._id], updatedInvoice);

      toast.success('Invoice edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useUpdateInvoiceStatus() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, status }) => updateInvoiceStatus(id, status),
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

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteInvoice(id),
    onSuccess: (_, id) => {
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



const getInvoiceReadySubtrips = async ({ queryKey }) => {
  const [, customerId] = queryKey;
  const { data } = await axios.get(
    `/api/subtrips/ready-subtrips/${customerId}`
  );
  return data;
};

export function useInvoiceReadySubtrips(customerId) {
  return useQuery({
    queryKey: [QUERY_KEY, 'ready-subtrips', customerId],
    queryFn: getInvoiceReadySubtrips,
    enabled: !!customerId,
  });
}