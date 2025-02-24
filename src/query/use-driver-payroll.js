import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import axios from 'src/utils/axios';

const ENDPOINT = '/api/driverPayrolls';
const QUERY_KEY = 'driverPayrolls';

// Fetchers
const getDriverPayrolls = async () => {
  const { data } = await axios.get(ENDPOINT);
  return data;
};

const getDriverPayroll = async (id) => {
  const { data } = await axios.get(`${ENDPOINT}/${id}`);
  return data;
};

const createDriverPayroll = async (driverPayroll) => {
  const { data } = await axios.post(ENDPOINT, driverPayroll);
  return data;
};

const updateDriverPayroll = async (id, driverPayrollData) => {
  console.log({ driverPayrollDataInAPICAll: driverPayrollData });
  const { data } = await axios.put(`${ENDPOINT}/${id}`, driverPayrollData);
  return data;
};

const deleteDriverPayroll = async (id) => {
  const { data } = await axios.delete(`${ENDPOINT}/${id}`);
  return data;
};

// Queries & Mutations
export function useDriverPayrolls() {
  return useQuery({ queryKey: [QUERY_KEY], queryFn: getDriverPayrolls });
}

export function useDriverPayroll(id) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getDriverPayroll(id),
    enabled: !!id,
  });
}

export function useCreateDriverPayroll() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createDriverPayroll,
    onSuccess: (newDriverPayroll) => {
      console.log({ newDriverPayroll });
      // updating list
      queryClient.setQueryData([QUERY_KEY], (prevDriverPayrolls) => [
        ...prevDriverPayrolls,
        newDriverPayroll,
      ]);
      // caching current driverPayroll
      queryClient.setQueryData([QUERY_KEY, newDriverPayroll._id], newDriverPayroll);
      toast.success('DriverPayroll added successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}

export function useUpdateDriverPayroll() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id, data }) => updateDriverPayroll(id, data),
    onSuccess: (updatedDriverPayroll) => {
      queryClient.setQueryData([QUERY_KEY], (prevDriverPayrolls) =>
        prevDriverPayrolls.map((driverPayroll) =>
          driverPayroll._id === updatedDriverPayroll._id ? updatedDriverPayroll : driverPayroll
        )
      );
      queryClient.setQueryData([QUERY_KEY, updatedDriverPayroll._id], updatedDriverPayroll);

      toast.success('DriverPayroll edited successfully!');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });

  return mutate;
}

export function useDeleteDriverPayroll() {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (id) => deleteDriverPayroll(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY], (prevDriverPayrolls) =>
        prevDriverPayrolls.filter((driverPayroll) => driverPayroll._id !== id)
      );
      toast.success('DriverPayroll deleted successfully!');
    },
    onError: (error) => {
      console.log({ error });
      const errorMessage = error?.message || 'An error occurred';
      toast.error(errorMessage);
    },
  });
  return mutate;
}
