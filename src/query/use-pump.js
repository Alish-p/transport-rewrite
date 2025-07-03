import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/pumps';
const QUERY_KEY = 'pumps';

// Fetchers
const getPumps = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getPump = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createPump = async (pump) => {
  const { data } = await axios.post(ENDPOINT, pump);
  return data;
};

const updatePump = async (id, pumpData) => {
  console.log({ pumpDataInAPICAll: pumpData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, pumpData);
  return data;
};

const deletePump = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function usePumps(enabled = true) {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getPumps,
    enabled,
  });
}

export function usePump(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getPump(id),
    enabled: !!id,
  });
}

export function useCreatePump() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createPump,
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Pump added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdatePump() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updatePump(id, data),
    onSuccess: (updatedPump) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedPump._id], updatedPump);

      toast.success('Pump edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeletePump() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deletePump(id),
    onSuccess: (_,) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Pump deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
