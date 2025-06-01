import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/trips';
const QUERY_KEY = 'trips';

// Fetchers
const getTrips = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getOpenTrips = async () => {
  const { data } = await axios.get(`${ENDPOINT}/open`);
  return data;
};

const getTrip = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createTrip = async (trip) => {
  const { data } = await axios.post(ENDPOINT, trip);
  return data;
};

const updateTrip = async (id, tripData) => {
  console.log({ tripDataInAPICAll: tripData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, tripData);
  return data;
};

const closeTrip = async (id) => {
  const { data } = await axios.put(`${ENDPOINT}/${id}/close`);
  return data;
};

const deleteTrip = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useTrips() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTrips });
}

export function useOpenTrips() {
  return useQuery({ queryKey: [QUERY_KEY, 'open'], queryFn: getOpenTrips });
}

export function useTrip(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTrip(id),
    enabled: !!id,
  });
}

export function useCreateTrip() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: createTrip,
    onSuccess: (newTrip) => {
      toast.success('Trip added successfully!');
      queryClient.invalidateQueries([QUERY_KEY]);
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutateAsync;
}

export function useUpdateTrip() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: ({ id, data }) => updateTrip(id, data),
    onSuccess: (updatedTrip) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedTrip._id], updatedTrip);

      toast.success('Trip edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useCloseTrip() {
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (id) => closeTrip(id),
    onSuccess: (updatedTrip) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      queryClient.setQueryData([QUERY_KEY, updatedTrip._id], updatedTrip);

      toast.success('Trip Closed successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutateAsync;
}

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTrip(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries([QUERY_KEY]);
      toast.success('Trip deleted successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
