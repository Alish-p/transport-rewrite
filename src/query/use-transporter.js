import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/transporters';
const QUERY_KEY = 'transporters';

// Fetchers
const getTransporters = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getTransporter = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createTransporter = async (transporter) => {
  const { data } = await axios.post(ENDPOINT, transporter);
  return data;
};

const updateTransporter = async (id, transporterData) => {
  console.log({ transporterDataInAPICAll: transporterData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, transporterData);
  return data;
};

const deleteTransporter = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useTransporters(options = {}) {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTransporters, ...options });
}

export function useTransporter(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTransporter(id),
    enabled: !!id,
  });
}

export function useCreateTransporter() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createTransporter,
    onSuccess: (newTransporter) => {
      console.log({ newTransporter });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevTransporters) => [
        ...prevTransporters,
        newTransporter,
      ]);
      // caching current transporter
      queryClient.setQueryData([QUERY_KEY, newTransporter._id], newTransporter);
      toast.success('Transporter added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateTransporter() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateTransporter(id, data),
    onSuccess: (updatedTransporter) => {
      queryClient.setQueryData([QUERY_KEY], (prevTransporters) =>
        prevTransporters.map((transporter) =>
          transporter._id === updatedTransporter._id ? updatedTransporter : transporter
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedTransporter._id], updatedTransporter);

      toast.success('Transporter edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteTransporter() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTransporter(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevTransporters) =>
        prevTransporters.filter((transporter) => transporter._id !== id)
      );
      toast.success('Transporter deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
