import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/diesel-prices';
const QUERY_KEY = 'diesel-prices';

const getDieselPrices = async ({ queryKey }) => {
  const { data } = await axios.get(`${ENDPOINT}`);
  return data;
};

const getDieselPriceOnDate = async ({ date, pump }) => {
  try {
    const { data } = await axios.get(`${ENDPOINT}/${pump}/${date}`);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    const errorMessage = error?.message || 'Failed to fetch diesel price.';
    toast.error(errorMessage);
    throw new Error(errorMessage);
  }
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
export function useDieselPrices() {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getDieselPrices,
  });
}

export function useDieselPriceOnDate({ date, pump }) {
  return useQuery({
    queryKey: [QUERY_KEY, pump, date],
    queryFn: () => getDieselPriceOnDate({ date, pump }),
    enabled: !!date && !!pump,
    onSettled: (data, error) => {
      if (error) {
        const errorMessage = error?.message || 'Failed to fetch diesel price.';
        toast.error(errorMessage);
      }
    },
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
  const { mutateAsync } = useMutation({
    mutationFn: createDieselPrice,
    onSuccess: (newDieselPrice) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('DieselPrice added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateDieselPrice() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateDieselPrice(id, data),
    onSuccess: (updatedDieselPrice) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedDieselPrice._id], updatedDieselPrice);

      toast.success('DieselPrice edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteDieselPrice() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteDieselPrice(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries([QUERY_KEY]);
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
