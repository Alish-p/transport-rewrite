import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/banks';
const QUERY_KEY = 'banks';

// Fetchers
const getBanks = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getBank = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createBank = async (bank) => {
  const { data } = await axios.post(ENDPOINT, bank);
  return data;
};

const updateBank = async (id, bankData) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}`, bankData);
  return data;
};

const deleteBank = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useBanks() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getBanks });
}

export function useBank(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getBank(id),
    enabled: !!id,
  });
}

export function useCreateBank() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createBank,
    onSuccess: (newBank) => {
      console.log({ newBank });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevBanks) => [...prevBanks, newBank]);
      // caching current bank
      queryClient.setQueryData([QUERY_KEY, newBank._id], newBank);
      toast.success('Bank added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateBank() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateBank(id, data),
    onSuccess: (updatedBank) => {
      queryClient.setQueryData([QUERY_KEY], (prevBanks) => [...prevBanks, updatedBank]);
      queryClient.setQueryData([QUERY_KEY, updatedBank._id], updatedBank);

      toast.success('Bank edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteBank() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteBank(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevBanks) =>
        prevBanks.filter((bank) => bank._id !== id)
      );
      toast.success('Bank deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
