import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/subtrips';
const QUERY_KEY = 'subtrips';

// Fetchers
const getSubtrips = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getSubtrip = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createSubtrip = async (subtrip) => {
  const { data } = await axios.post(ENDPOINT, subtrip);
  return data;
};

const updateSubtrip = async (id, subtripData) => {
  console.log({ subtripDataInAPICAll: subtripData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, subtripData);
  return data;
};

const deleteSubtrip = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useSubtrips() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getSubtrips });
}

export function useSubtrip(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getSubtrip(id),
    enabled: !!id,
  });
}

export function useCreateSubtrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createSubtrip,
    onSuccess: (newSubtrip) => {
      console.log({ newSubtrip });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) => [...prevSubtrips, newSubtrip]);
      // caching current subtrip
      queryClient.setQueryData([QUERY_KEY, newSubtrip._id], newSubtrip);
      toast.success('Subtrip added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateSubtrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateSubtrip(id, data),
    onSuccess: (updatedSubtrip) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) =>
        prevSubtrips.map((subtrip) =>
          subtrip._id === updatedSubtrip._id ? updatedSubtrip : subtrip
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedSubtrip._id], updatedSubtrip);

      toast.success('Subtrip edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteSubtrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteSubtrip(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevSubtrips) =>
        prevSubtrips.filter((subtrip) => subtrip._id !== id)
      );
      toast.success('Subtrip deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
