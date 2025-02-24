import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/diesel-prices';
const QUERY_KEY = 'diesel-prices';

const getDieselPrices = async ({ queryKey }) => {
  const [, filters] = queryKey; // Extract filters from queryKey
  const { pump, startDate, endDate } = filters || {};

  let query = `${ENDPOINT}?`;

  if (pump) query += `pump=${pump}&`;
  if (startDate) query += `startDate=${startDate}&`;
  if (endDate) query += `endDate=${endDate}&`;

  const { data } = await axios.get(query);
  return data;
};

const getDieselPrice = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createDieselPrice = async (dieselPrice) => {
  const { data } = await axios.post(ENDPOINT, dieselPrice);
  return data;
};

const updateDieselPrice = async (id, dieselPriceData) => {
  console.log({ dieselPriceDataInAPICAll: dieselPriceData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, dieselPriceData);
  return data;
};

const deleteDieselPrice = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useDieselPrices(filters = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, filters],
    queryFn: getDieselPrices,
  });
}

export function useDieselPrice(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getDieselPrice(id),
    enabled: !!id,
  });
}

export function useCreateDieselPrice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createDieselPrice,
    onSuccess: (newDieselPrice) => {
      console.log({ newDieselPrice });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevDieselPrices) => [
        ...prevDieselPrices,
        newDieselPrice,
      ]);
      // caching current dieselPrice
      queryClient.setQueryData([QUERY_KEY, newDieselPrice._id], newDieselPrice);
      toast.success('DieselPrice added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateDieselPrice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateDieselPrice(id, data),
    onSuccess: (updatedDieselPrice) => {
      queryClient.setQueryData([QUERY_KEY], (prevDieselPrices) =>
        prevDieselPrices.map((dieselPrice) =>
          dieselPrice._id === updatedDieselPrice._id ? updatedDieselPrice : dieselPrice
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedDieselPrice._id], updatedDieselPrice);

      toast.success('DieselPrice edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteDieselPrice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteDieselPrice(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevDieselPrices) =>
        prevDieselPrices.filter((dieselPrice) => dieselPrice._id !== id)
      );
      toast.success('DieselPrice deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
