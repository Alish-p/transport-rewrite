import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/drivers';
const QUERY_KEY = 'drivers';

// Fetchers
const getDrivers = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getDriver = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createDriver = async (driver) => {
  const { data } = await axios.post(ENDPOINT, driver);
  return data;
};

const updateDriver = async (id, driverData) => {
  console.log({ driverDataInAPICAll: driverData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, driverData);
  return data;
};

const deleteDriver = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useDrivers(options = {}) {
  return useQuery({
    queryKey: [QUERY_KEY],
    queryFn: getDrivers,
    ...options,
  });
}

export function useDriver(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getDriver(id),
    enabled: !!id,
  });
}

export function useCreateDriver() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createDriver,
    onSuccess: (newDriver) => {
      queryClient.setQueryData([QUERY_KEY], (oldData) => {
        if (!oldData) return [newDriver];

        return [...oldData, newDriver];
      });

      queryClient.setQueryData([QUERY_KEY, newDriver._id], newDriver);

      toast.success('Driver added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateDriver() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateDriver(id, data),
    onSuccess: (updatedDriver) => {
      queryClient.setQueryData([QUERY_KEY], (oldData) => {
        if (!oldData) return [updatedDriver];

        return oldData.map((driver) => (driver._id === updatedDriver._id ? updatedDriver : driver));
      });

      queryClient.setQueryData([QUERY_KEY, updatedDriver._id], updatedDriver);

      toast.success('Driver edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteDriver() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteDriver(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (oldData) => {
        if (!oldData) return [];

        return oldData.filter((driver) => driver._id !== id);
      });

      queryClient.removeQueries([QUERY_KEY, id]);

      toast.success('Driver deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
