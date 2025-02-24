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
  console.log({ invoiceDataInAPICAll: invoiceData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, invoiceData);
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
  const { mutate } = useMutation({
    mutationFn: createInvoice,
    onSuccess: (newInvoice) => {
      console.log({ newInvoice });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevInvoices) => [...prevInvoices, newInvoice]);
      // caching current invoice
      queryClient.setQueryData([QUERY_KEY, newInvoice._id], newInvoice);
      toast.success('Invoice added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: (updatedInvoice) => {
      queryClient.setQueryData([QUERY_KEY], (prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === updatedInvoice._id ? updatedInvoice : invoice
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedInvoice._id], updatedInvoice);

      toast.success('Invoice edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteInvoice(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevInvoices) =>
        prevInvoices.filter((invoice) => invoice._id !== id)
      );
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
