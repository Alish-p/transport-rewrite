import { toast } from 'sonner';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/customers';
const QUERY_KEY = 'customers';

// Fetchers
const getCustomers = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getPaginatedCustomers = async (params) => {
  const { data } = await axios.get(`${ENDPOINT}`, { params });
  return data;
};

const getCustomersSummary = async () => {
  const { data } = await axios.get(`${ENDPOINT}/summary`);
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

export function usePaginatedCustomers(params, options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, 'paginated', params],
    queryFn: () => getPaginatedCustomers(params),
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useInfiniteCustomers(params, options = {}) {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY, 'infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      getPaginatedCustomers({ ...(params || {}), page: pageParam }),
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + page.customers.length,
        0
      );
      return totalFetched < lastPage.total ? allPages.length + 1 : undefined;
    },
    keepPreviousData: true,
    enabled: !!params,
    ...options,
  });
}

export function useCustomersSummary() {
  return useQuery({ queryKey: [QUERY_KEY, 'summary'], queryFn: getCustomersSummary });
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
      queryClient.invalidateQueries([QUERY_KEY]);
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
      // Update the specific customer in the cache
      queryClient.setQueryData([QUERY_KEY, updatedCustomer._id], updatedCustomer);

      // Update the customer in the customers list cache
      queryClient.setQueryData([QUERY_KEY], (oldData) => {
        if (!oldData) return [updatedCustomer];
        return oldData.map((customer) =>
          customer._id === updatedCustomer._id ? updatedCustomer : customer
        );
      });

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
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Customer deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
