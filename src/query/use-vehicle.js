import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/vehicles';
const QUERY_KEY = 'vehicles';

// Fetchers
const getVehicles = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getVehicle = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createVehicle = async (vehicle) => {
  const { data } = await axios.post(ENDPOINT, vehicle);
  return data;
};

const updateVehicle = async (id, vehicleData) => {
  console.log({ vehicleDataInAPICAll: vehicleData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, vehicleData);
  return data;
};

const deleteVehicle = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useVehicles() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getVehicles });
}

export function useVehicle(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getVehicle(id),
    enabled: !!id,
  });
}

export function useCreateVehicle() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createVehicle,
    onSuccess: (newVehicle) => {
      console.log({ newVehicle });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevVehicles) => [...prevVehicles, newVehicle]);
      // caching current vehicle
      queryClient.setQueryData([QUERY_KEY, newVehicle._id], newVehicle);
      toast.success('Vehicle added successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateVehicle() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: (updatedVehicle) => {
      queryClient.setQueryData([QUERY_KEY], (prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === updatedVehicle._id ? updatedVehicle : vehicle
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedVehicle._id], updatedVehicle);

      toast.success('Vehicle edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteVehicle() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteVehicle(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevVehicles) =>
        prevVehicles.filter((vehicle) => vehicle._id !== id)
      );
      toast.success('Vehicle deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
