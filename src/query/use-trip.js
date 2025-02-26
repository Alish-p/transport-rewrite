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

const deleteTrip = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useTrips() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getTrips });
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
      console.log({ newTrip });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevTrips) => [...prevTrips, newTrip]);
      // caching current trip
      queryClient.setQueryData([QUERY_KEY, newTrip._id], newTrip);
      toast.success('Trip added successfully!');
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
      queryClient.setQueryData([QUERY_KEY], (prevTrips) =>
        prevTrips.map((trip) => (trip._id === updatedTrip._id ? updatedTrip : trip))
      );
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

export function useDeleteTrip() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteTrip(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevTrips) =>
        prevTrips.filter((trip) => trip._id !== id)
      );
      toast.success('Trip deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
