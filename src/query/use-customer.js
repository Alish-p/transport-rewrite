import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/customers';
const QUERY_KEY = 'customers';

// Fetchers
const getCustomers = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getCustomer = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createCustomer = async (customer) => {
  const { data } = await axios.post(ENDPOINT, customer);
  return data;
};

const updateCustomer = async (id, customerData) => {
  console.log({ customerDataInAPICAll: customerData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, customerData);
  return data;
};

const deleteCustomer = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useCustomers() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getCustomers });
}

export function useCustomer(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getCustomer(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      console.log({ newCustomer });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevCustomers) => [...prevCustomers, newCustomer]);
      // caching current customer
      queryClient.setQueryData([QUERY_KEY, newCustomer._id], newCustomer);
      toast.success('Customer added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: (updatedCustomer) => {
      queryClient.setQueryData([QUERY_KEY], (prevCustomers) =>
        prevCustomers.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedCustomer._id], updatedCustomer);

      toast.success('Customer edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteCustomer(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevCustomers) =>
        prevCustomers.filter((customer) => customer._id !== id)
      );
      toast.success('Customer deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
